import { Address } from 'cluster';
import { UserPreferences } from './user-preferences.interface';

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  address?: Address;
  preferences: UserPreferences;
}
