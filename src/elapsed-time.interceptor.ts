import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { performance } from 'perf_hooks';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<'http' | 'graphql'>();

    let request: Request;
    let response: Response;
    let handlerName = '';

    if (contextType === 'http') {
      const ctx = context.switchToHttp();
      request = ctx.getRequest<Request>();
      response = ctx.getResponse<Response>();
    } else if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext();
      request = ctx.req;
      response = ctx.res;
      handlerName = gqlContext.getHandler().name;
    } else {
      return next.handle();
    }

    if (!request) {
      return next.handle();
    }

    const start = performance.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = performance.now() - start;
        const logMessage =
          contextType === 'graphql'
            ? `GraphQL ${handlerName} took ${elapsed.toFixed(2)}ms`
            : `HTTP ${request.method} ${request.url} took ${elapsed.toFixed(2)}ms`;

        console.log(logMessage);

        if (response) {
          if (this.isApiRequest(request)) {
            response.setHeader('X-Elapsed-Time', `${elapsed.toFixed(2)}ms`);
          }

          if (this.isRenderRequest(request)) {
            // Добавляем время в заголовок и в locals для шаблона
            response.setHeader('X-Server-Timing', `total;dur=${elapsed.toFixed(2)}`);
            response.locals.elapsedTime = elapsed.toFixed(2);
          }
        }
      }),
    );
  }

  private isApiRequest(request: Request): boolean {
    return (
      request.path?.startsWith('/api/') ||
      !!request.headers['content-type']?.includes('application/json')
    );
  }

  private isRenderRequest(request: Request): boolean {
    return (
      !!request.headers.accept?.includes('text/html') &&
      !this.isApiRequest(request)
    );
  }
}
