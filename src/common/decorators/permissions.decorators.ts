import { SetMetadata } from '@nestjs/common';
import { Permission } from '@prisma/client';

export const PERMISSIONS_KEY = 'permission';
export const Permissions = (...roles: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);
