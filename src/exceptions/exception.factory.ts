import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorMessages } from './error-messages';

export class ErrorFactory {
  static create(
    code: keyof typeof ErrorMessages,
    details?: any,
    status?: HttpStatus,
  ): CustomException {
    return new CustomException({
      message: ErrorMessages[code],
      code: code,
      status: status || HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    });
  }
}
