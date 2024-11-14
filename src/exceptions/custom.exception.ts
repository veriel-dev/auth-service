import { HttpException, HttpStatus } from '@nestjs/common';

export interface ICustomError {
  message: string;
  code: string | number;
  status: HttpStatus;
  details?: any;
}

export class CustomException extends HttpException {
  constructor(error: ICustomError) {
    super(
      {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      error.status,
    );
  }
}
