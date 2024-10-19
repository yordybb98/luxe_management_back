import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorators';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const missingPermissions = requiredPermission.filter(
      (permission) => !user.role.permissions.includes(permission),
    );

    if (missingPermissions.length > 0) {
      const request = context.switchToHttp().getRequest();
      const url = request.url; // Get the request URL

      console.error('User permissions:', user.role.permissions);
      console.error(`Unauthorized access to URL: ${url}`);
      console.error('Missing permissions:', missingPermissions); // Log the missing permissions

      throw new ForbiddenException(
        'You do not have enough access to perform this action.',
      );
    }

    return true;
  }
}
