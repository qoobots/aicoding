import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingGuard implements CanActivate {
  private readonly logger = new Logger(LoggingGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;

    this.logger.log(`${method} ${url} from ${ip}`);

    return true;
  }
}
