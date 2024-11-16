export interface LoginHistory {
  date: Date;
  ip: string;
  userAgent: string;
  success: boolean;
  location?: string;
}
