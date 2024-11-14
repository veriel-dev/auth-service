import { LogColors } from '../interfaces/logger-colors.interface';

export const ANSI_COLORS = {
  // Colores básicos
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Colores de texto
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Colores de fondo
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

export const LOG_COLORS: LogColors = {
  timestamp: ANSI_COLORS.bright + ANSI_COLORS.white,
  level: {
    ERROR: ANSI_COLORS.bright + ANSI_COLORS.red,
    WARN: ANSI_COLORS.yellow,
    INFO: ANSI_COLORS.green,
    DEBUG: ANSI_COLORS.cyan,
    VERBOSE: ANSI_COLORS.magenta,
  },
  context: ANSI_COLORS.bright + ANSI_COLORS.blue,
  message: ANSI_COLORS.reset,
};
