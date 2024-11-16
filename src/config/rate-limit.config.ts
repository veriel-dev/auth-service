import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import {
  RATE_LIMIT_RULES,
  SECURITY_ERROR_MESSAGES,
} from '../common/constants/security.constants';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiters: Map<string, RateLimiterMemory> = new Map();
  constructor(private reflector: Reflector) {
    // Inicializar limiters para diferentes rutas
    this.initializeLimiters();
  }
  private initializeLimiters() {
    // Limiter para login
    this.limiters.set(
      'login',
      new RateLimiterMemory({
        points: RATE_LIMIT_RULES.LOGIN.LIMIT,
        duration: RATE_LIMIT_RULES.LOGIN.TTL,
      }),
    );

    // Limiter para registro
    this.limiters.set(
      'register',
      new RateLimiterMemory({
        points: RATE_LIMIT_RULES.REGISTER.LIMIT,
        duration: RATE_LIMIT_RULES.REGISTER.TTL,
      }),
    );

    // Limiter para recuperación de contraseña
    this.limiters.set(
      'forgotPassword',
      new RateLimiterMemory({
        points: RATE_LIMIT_RULES.FORGOT_PASSWORD.LIMIT,
        duration: RATE_LIMIT_RULES.FORGOT_PASSWORD.TTL,
      }),
    );
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const routeKey = this.getRouteKey(context);
    const limiter = this.limiters.get(routeKey);

    if (!limiter) {
      return true;
    }
    try {
      await limiter.consume(request.ip);
      return true;
    } catch (__) {
      throw new Error(SECURITY_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }
  }
  private getRouteKey(context: ExecutionContext): string {
    const handler = context.getHandler();
    const routeKey = this.reflector.get<string>('rateLimit', handler);
    return routeKey || 'default';
  }
}
