import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET || 'super-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '24h',
  };
});
