export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  emailNotifications: boolean;
  notifications: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
  };
}
