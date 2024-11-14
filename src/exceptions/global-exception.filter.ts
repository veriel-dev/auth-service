import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from '../exceptions/custom.exception';
import { ErrorCodes } from './error-code';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Manejar CustomException
    if (exception instanceof CustomException) {
      const exceptionResponse = exception.getResponse() as any;
      status = exception.getStatus();
      body = {
        ...body,
        ...exceptionResponse,
        statusCode: status,
      };
    }
    // Manejar HttpException estándar
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      body = {
        ...body,
        statusCode: status,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message,
        code: 'GENERIC_ERROR',
      };
    }
    // Manejar errores inesperados
    else if (exception instanceof Error) {
      body = {
        ...body,
        message: exception.message,
        code: ErrorCodes.GENERIC.UNEXPECTED_ERROR,
      };
    }

    response.status(status).json(body);
  }
}
