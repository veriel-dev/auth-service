import { UserRole } from '../enums/user-role';

export class UserResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  plan: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
