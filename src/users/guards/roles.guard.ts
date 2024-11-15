import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log({ user });

    this.logger.debug(`User data: ${JSON.stringify(user)}`);
    if (!user || !user.roles) {
      this.logger.warn(`No user or role found in request`);
      throw ErrorFactory.create(
        ErrorCodes.AUTH.INSUFFICIENT_PERMISSIONS,
        undefined,
        HttpStatus.FORBIDDEN,
      );
    }
    const hasRole = requiredRoles.includes(user.roles);
    this.logger.debug(`User has required role: ${hasRole}`);

    if (!hasRole) {
      throw ErrorFactory.create(
        ErrorCodes.AUTH.INSUFFICIENT_PERMISSIONS,
        undefined,
        HttpStatus.FORBIDDEN,
      );
    }

    return hasRole;
  }
}

import { SetMetadata } from '@nestjs/common';
import { ErrorFactory } from '../../exceptions/exception.factory';
import { ErrorCodes } from '../../exceptions/error-code';
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
