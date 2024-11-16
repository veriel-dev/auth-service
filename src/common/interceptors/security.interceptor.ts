import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SecurityInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, path } = request;
    const userAgent = request.get('user-agent') || '';

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `${method} ${path} ${ip} ${userAgent}`,
            'SecurityInterceptor',
          );
        },
        error: (error) => {
          this.logger.error(
            `${method} ${path} ${ip} ${userAgent} ${error.message}`,
            'SecurityInterceptor',
          );
        },
      }),
    );
  }
}
