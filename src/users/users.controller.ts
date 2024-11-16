import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserStatusDto } from './dto/update-status.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  /* Create User */
  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado de forma éxitosa',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creando nuevo usuario');
    return await this.usersService.create(createUserDto);
  }
  /* Search User*/
  @Get()
  @ApiOperation({ summary: 'Obtener usuarios con filtros y paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    this.logger.log(`Obteniendo usuarios - Page: ${page}, Limit: ${limit}`);
    return await this.usersService.findAll({
      page,
      limit,
      search,
      orderBy,
      order,
    });
  }
  /* Get User By Id */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario encontrado' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Buscando usuario con ID: ${id}`);
    return await this.usersService.findById(id);
  }
  /* Updater User By Id */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`Actualizando usuario con ID: ${id}`);
    return await this.usersService.update(id, updateUserDto);
  }
  /* Soft Delete */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Eliminando usuario con ID: ${id}`);
    return await this.usersService.softDelete(id);
  }
  /* Verify Email */
  @Post(':id/verify-email/:token')
  @ApiOperation({ summary: 'Verificar email de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verificado exitosamente',
  })
  async verifyEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('token') token: string,
  ) {
    this.logger.log(`Verificando email para usuario ${id}`);
    return await this.usersService.verifyEmail(id, token);
  }
  /* Update Password */
  @Patch(':id/password')
  @ApiOperation({ summary: 'Actualizar contraseña' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña actualizada exitosamente',
  })
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.log(`Actualizando contraseña para usuario ${id}`);
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }
  /* Update Status */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de cuenta' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado actualizado exitosamente',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    this.logger.log(`Actualizando estado para usuario ${id}`);
    return await this.usersService.updateAccountStatus(id, updateStatusDto);
  }
}
