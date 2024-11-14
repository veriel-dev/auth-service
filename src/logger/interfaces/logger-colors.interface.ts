export interface LogColors {
  timestamp: string;
  level: {
    ERROR: string;
    WARN: string;
    INFO: string;
    DEBUG: string;
    VERBOSE: string;
  };
  context: string;
  message: string;
}
