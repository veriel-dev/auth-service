export interface UserStats {
  accountAge: number;
  lastLogin: Date;
  loginCount: number;
  lastUpdated: Date;
  verificationStatus: {
    email: boolean;
    phone?: boolean;
  };
  activityMetrics: {
    totalLogins: number;
    failedLogins: number;
    passwordChanges: number;
  };
}
