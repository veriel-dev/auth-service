import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAuthDto } from '../dto/create-auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dto = plainToClass(CreateAuthDto, request.body);

    this.logger.debug(`Intento de autenticación`, {
      email: request.body.email,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      method: request.method,
      path: request.path,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: this.formatErrors(errors),
      });
    }
    const canActivate = await super.canActivate(context);
    return canActivate as boolean;
  }
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new BadRequestException('Authentication failed');
    }
    return user;
  }
  private formatErrors(errors: any[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}
