import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { QueryFailedError, Repository, SelectQueryBuilder } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUtil } from '../common/utils/password.util';
import { randomBytes } from 'crypto';
import { PaginatedResponse, UserSearchParams } from './interfaces';
import { PaginationUtil } from '../common/utils/pagination.util';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserStatusDto } from './dto/update-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  // CRUD básicas con manejor de erroes
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.validateUniqueEmail(createUserDto.email);
      if (!PasswordUtil.validate(createUserDto.password)) {
        throw new BadRequestException(
          'La contraseña no cumple con los requisitos mínimos',
        );
      }
      // Crear usuario
      const user = this.userRepository.create({
        ...createUserDto,
        password: await PasswordUtil.hash(createUserDto.password),
        emailVerificationToken: randomBytes(32).toString('hex'),
        emailVerificationTokenExpires: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ),
      });
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
  async findById(id: string, relations: string[] = []): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations,
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
  async findAll(
    searchParams: UserSearchParams,
  ): Promise<PaginatedResponse<User>> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Aplicar filtros
      this.applySearchFilters(queryBuilder, searchParams);

      // Aplicar ordenamiento
      this.applySorting(queryBuilder, searchParams);
      // Obtener total
      const total = await queryBuilder.getCount();

      // Aplicar paginación
      const { take, skip } = PaginationUtil.getPaginationParams(
        searchParams.page || 1,
        searchParams.limit || 10,
      );

      queryBuilder.take(take).skip(skip);
      // Ejecutar query
      const users = await queryBuilder.getMany();

      return PaginationUtil.createPaginatedResponse(
        users,
        total,
        searchParams.page || 1,
        searchParams.limit || 10,
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Actualizando usuario con ID: ${id}`);

    try {
      const user = await this.findById(id);

      // Si se intenta actualizar el email, verificar que sea único
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        await this.validateUniqueEmail(updateUserDto.email);
      }

      // Validar y actualizar campos
      const updatedUser = Object.assign(user, {
        ...updateUserDto,
        updatedAt: new Date(),
      });

      // Guardar cambios
      const savedUser = await this.userRepository.save(updatedUser);

      return savedUser;
    } catch (error) {
      this.logger.error(`Error actualizando usuario ${id}:`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }
  async softDelete(id: string): Promise<void> {
    this.logger.log(`Realizando soft delete del usuario con ID: ${id}`);

    try {
      const user = await this.findById(id);

      // Actualizar campos para soft delete
      user.isActive = false;
      user.deactivatedAt = new Date();
      user.email = `deleted_${user.id}_${user.email}`; // Mantener unicidad de email
      user.tokenVersion += 1; // Invalidar tokens existentes

      // Guardar cambios
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error en soft delete del usuario ${id}:`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }
  // Métodos de verificación y seguridad
  async verifyEmail(userId: string, token: string): Promise<void> {
    const user = await this.findById(userId);

    if (
      !user.emailVerificationToken ||
      user.emailVerificationToken !== token ||
      user.emailVerificationTokenExpires < new Date()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;

    await this.userRepository.save(user);
  }
  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const user = await this.findById(userId);

    // Validar contraseña actual
    const isCurrentPasswordValid = await PasswordUtil.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Validar nueva contraseña
    if (!PasswordUtil.validate(updatePasswordDto.newPassword)) {
      throw new BadRequestException(
        'La nueva contraseña no cumple con los requisitos',
      );
    }

    // Guardar contraseña anterior en historial
    user.passwordHistory = [
      { password: user.password, changedAt: new Date() },
      ...(user.passwordHistory || []).slice(0, 4), // Mantener últimas 5
    ];
    // Actualizar contraseña
    user.password = await PasswordUtil.hash(updatePasswordDto.newPassword);
    user.tokenVersion += 1; // Invalidar tokens existentes

    await this.userRepository.save(user);
  }
  // Métodos de gestión de estad
  async updateAccountStatus(
    userId: string,
    updateStatusDto: UpdateUserStatusDto,
  ): Promise<User> {
    const user = await this.findById(userId);

    user.isActive = updateStatusDto.isActive;

    if (!updateStatusDto.isActive) {
      user.deactivationReason = updateStatusDto.reason;
      user.deactivatedAt = new Date();
      user.tokenVersion += 1;
    }
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
  // Métodos privados de utilidad
  private async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }
  }
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<User>,
    searchParams: UserSearchParams,
  ) {
    if (searchParams.search) {
      queryBuilder.where(
        '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${searchParams.search}%` },
      );
    }

    if (searchParams.role) {
      queryBuilder.andWhere('user.role = :role', { role: searchParams.role });
    }

    if (searchParams.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: searchParams.isActive,
      });
    }

    if (searchParams.startDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', {
        startDate: searchParams.startDate,
      });
    }

    if (searchParams.endDate) {
      queryBuilder.andWhere('user.createdAt <= :endDate', {
        endDate: searchParams.endDate,
      });
    }
  }
  private applySorting(
    queryBuilder: SelectQueryBuilder<User>,
    searchParams: UserSearchParams,
  ): void {
    const orderBy = searchParams.orderBy || 'createdAt';
    const order = searchParams.order || 'DESC';

    queryBuilder.orderBy(`user.${orderBy}`, order);
  }
  private handleDatabaseError(error: any): never {
    this.logger.error('Database error', error.stack);

    if (error instanceof QueryFailedError) {
      // Manejar errores específicos de la base de datos
      if (error.message.includes('unique constraint')) {
        throw new ConflictException('Registro duplicado');
      }
    }

    throw new InternalServerErrorException('Error en la base de datos');
  }
}
