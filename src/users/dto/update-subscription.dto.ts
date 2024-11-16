import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';

export interface UpdateSubscriptionDto {
  status: SubscriptionStatus;
  endDate: Date;
  billingDetails: {
    name: string;
    address: string;
    city: string;
    country: string;
    vatNumber?: string;
  };
}
