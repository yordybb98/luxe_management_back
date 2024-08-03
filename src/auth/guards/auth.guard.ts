import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { extractTokenFromHeader } from 'src/utils/utils';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // We're checking if the request is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      // We're verifying the token here
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      // If the token is expired, we're throwing an error
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired', {
          cause: new Error(),
          description: {
            token,
            expiredAt: error.expiredAt,
          } as any,
        });
      }

      // Unknown error, we're throwing an error
      throw new UnauthorizedException('Invalid token', {
        cause: new Error(),
        description: error,
      });
    }
    return true;
  }
}
