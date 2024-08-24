import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  Admin = 'Admin',
  Guest = 'Guest',
  SuperAdmin = 'Superadmin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
