import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { ApiResponse } from '../dtos/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.message : '内部服务器错误';

    const error = this.exceptionToString(exception);

    // 记录错误日志
    this.logger.error(`${request.method} ${request.url}`, error);

    // 发送错误响应
    response.status(status).json(ApiResponse.error(message));
  }

  private exceptionToString(exception: unknown): string {
    if (exception instanceof Error) {
      return `${exception.name}: ${exception.message}\n${exception.stack}`;
    }
    return String(exception);
  }
}
