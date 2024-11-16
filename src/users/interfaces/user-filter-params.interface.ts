import { UserRole } from '../../common/enums/user-role.enum';

export interface UserFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}
