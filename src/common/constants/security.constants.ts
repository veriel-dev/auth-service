export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 100,
  PATTERNS: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBERS: /[0-9]/,
    SPECIAL_CHARS: /[!@#$%^&*]/,
  },
};

export const RATE_LIMIT_RULES = {
  LOGIN: {
    TTL: 60,
    LIMIT: 5,
  },
  REGISTER: {
    TTL: 3600,
    LIMIT: 3,
  },
  FORGOT_PASSWORD: {
    TTL: 3600,
    LIMIT: 3,
  },
};

export const SECURITY_ERROR_MESSAGES = {
  INVALID_PASSWORD_LENGTH: 'La contraseña debe tener entre 8 y 100 caracteres',
  INVALID_PASSWORD_PATTERN:
    'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales',
  RATE_LIMIT_EXCEEDED: 'Demasiados intentos. Por favor, espere un momento',
  INVALID_TOKEN: 'Token inválido o expirado',
};
