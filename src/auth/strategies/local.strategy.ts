import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ErrorFactory } from '../../exceptions/exception.factory';
import { ErrorCodes } from '../../exceptions/error-code';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      // passReqToCallback: true,
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.warn(`Intento de acceso fallido`, {
        email,
        timestamp: new Date().toISOString(),
      });
      throw ErrorFactory.create(
        ErrorCodes.AUTH.INVALID_CREDENTIALS,
        undefined,
        HttpStatus.UNAUTHORIZED,
      );
    }
    this.logger.log(`Autenticación exitosa`, {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });
    return user;
  }
}
