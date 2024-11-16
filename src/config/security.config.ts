import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  bcrypt: {
    saltRounds: parseInt(process.env.BRCRYPT_SALT_ROUNDS || '12', 10),
  },
  password: {
    minLength: 8,
    maxLength: 100,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  },
  rateLimit: {
    ttl: 60,
    limit: 10,
  },
}));
