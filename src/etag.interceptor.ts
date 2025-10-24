import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as crc32 from 'crc-32';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Определяем тип контекста (HTTP или GraphQL)
    const contextType = context.getType<'http' | 'graphql'>();

    let request: Request;
    let response: Response;

    if (contextType === 'http') {
      const ctx = context.switchToHttp();
      request = ctx.getRequest<Request>();
      response = ctx.getResponse<Response>();
    } else if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const { req, res } = ctx.getContext();
      request = req;
      response = res;
    } else {
      return next.handle();
    }

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
      return next.handle();
    }

    const ifNoneMatch = request.headers['if-none-match'];

    return next.handle().pipe(
      map((data) => {
        if (!data) return data;

        const etag = crc32.str(JSON.stringify(data)).toString(16);

        if (ifNoneMatch === etag) {
          response.status(304).end();
          return null;
        }

        response.setHeader('ETag', etag);

        if (request.method === 'GET') {
          response.setHeader('Cache-Control', 'public, max-age=3600');
        }

        return data;
      }),
    );
  }
}
