import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';
import { DEFAULT_PREFERENCES } from '../../common/constants/user.constants';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  @Exclude()
  password: string;

  // Información Personal
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column('jsonb', { nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  // Rol y Estado
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  deactivationReason: string;

  @Column({ nullable: true })
  deactivatedAt: Date;

  // Verificación de Email
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  emailVerificationTokenExpires: Date;

  // Seguridad
  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lockUntil: Date;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column('jsonb', { default: [] })
  loginHistory: {
    date: Date;
    ip: string;
    userAgent: string;
    success: boolean;
  }[];
  @Column('jsonb', { default: [] })
  @Exclude()
  passwordHistory: {
    password: string;
    changedAt: Date;
  }[];

  // Preferencias
  @Column('jsonb', { default: DEFAULT_PREFERENCES })
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    emailNotifications: boolean;
    notifications: {
      marketing: boolean;
      security: boolean;
      updates: boolean;
    };
  };
  // TimeStamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos Helper
  @Transform(({ value }) => `${value.firstName} ${value.lastName}`.trim())
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  isLocked(): boolean {
    return this.lockUntil && this.lockUntil > new Date();
  }

  incrementLoginAttempts(): void {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    }
  }

  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockUntil = null;
  }

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
}
