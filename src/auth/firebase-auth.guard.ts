import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as admin from 'firebase-admin';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGraphQL =
      context.getType<'graphql' | 'http' | 'rpc'>() === 'graphql';

    const request = isGraphQL
      ? GqlExecutionContext.create(context).getContext().req
      : context.switchToHttp().getRequest();

    const token = request.token || this.extractToken(request);

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;

      if (isGraphQL) {
        GqlExecutionContext.create(context).getContext().user = decodedToken;
      }

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = decodedToken.role;
        if (!userRole || !requiredRoles.includes(userRole))
          throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof ForbiddenException
      )
        throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(req: any): string | null {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
    }

    const cookies = req.headers.cookie;
    if (!cookies) return null;

    const match = cookies.match(/token=([^;]+)/);
    return match ? match[1] : null;
  }
}
