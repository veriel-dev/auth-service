import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';

export interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isEmailVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
