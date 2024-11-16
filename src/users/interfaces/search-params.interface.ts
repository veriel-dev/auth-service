import { UserRole } from '../../common/enums/user-role.enum';

export interface UserSearchParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
