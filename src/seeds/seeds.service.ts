import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async clearDataBase() {
    this.logger.log('Limpiando la base de datos...');
    await this.userRepository.clear();
  }

  async seedDatabase() {
    try {
      this.logger.log('Iniciando seed de base de datos...');
      // Clean BBDD
      await this.clearDataBase();
      // Create Admin
      this.createAdminUser();
      // Crear Current Users
      await this.createRegularUsers();
      // Create  User with status diferents
      await this.createUsersWithDifferentStates();
      this.logger.log('Seed completado exitosamente');
      return { message: 'Base de datos poblada exitosamente' };
    } catch (error) {
      this.logger.error('Error durante el seed:', error);
      throw error;
    }
  }
  private async createAdminUser() {
    const adminPassword = await bcrypt.hash('Admin123!', 12);

    await this.userRepository.save({
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'es',
        emailNotifications: true,
        notifications: {
          marketing: false,
          security: true,
          updates: true,
        },
      },
    });
  }
  private async createRegularUsers(): Promise<void> {
    const regularUsers: Partial<User>[] = await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, index) => {
          const password = await bcrypt.hash('User123!', 12);
          return {
            email: `user${index + 1}@example.com`,
            password,
            firstName: `User${index + 1}`,
            lastName: 'Test',
            role: UserRole.USER,
            isEmailVerified: true,
            isActive: true,
            preferences: {
              theme: index % 2 === 0 ? 'light' : 'dark',
              language: 'es',
              emailNotifications: true,
              notifications: {
                marketing: true,
                security: true,
                updates: true,
              },
            },
          };
        }),
    );

    await this.userRepository.save(regularUsers);
  }
  private async createUsersWithDifferentStates() {
    const specialCases = [
      {
        email: 'unverified@example.com',
        isEmailVerified: false,
        isActive: true,
      },
      {
        email: 'inactive@example.com',
        isEmailVerified: true,
        isActive: false,
        deactivatedAt: new Date(),
        deactivationReason: 'Usuario inactivo por pruebas',
      },
      {
        email: 'locked@example.com',
        isEmailVerified: true,
        isActive: true,
        loginAttempts: 5,
        lockUntil: new Date(Date.now() + 3600000), // Bloqueado por 1 hora
      },
    ];

    const specialUsers = await Promise.all(
      specialCases.map(async (specialCase) => {
        const password = await bcrypt.hash('Special123!', 12);
        return {
          ...specialCase,
          password,
          firstName: 'Special',
          lastName: 'User',
          role: UserRole.USER,
        };
      }),
    );

    await this.userRepository.save(specialUsers);
  }
}
