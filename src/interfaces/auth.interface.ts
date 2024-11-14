export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
