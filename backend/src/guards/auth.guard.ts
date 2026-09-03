import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppJwtService } from '../helpers/jwt/jwt.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { ROLES_KEY, Role } from '../decorators/role.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AppJwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    try {
      // Verify access token
      const user = await this.jwtService.verifyAuthToken(token);

      // Attach user to request
      request.user = user;

      // Get required roles from @Roles()
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // No role restriction OR ALL
      if (!requiredRoles || requiredRoles.includes('ALL')) {
        return true;
      }

      // Check user's role
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You do not have permission');
      }

      return true;
    } catch (error) {
      // Don't convert authorization failure into 401
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
