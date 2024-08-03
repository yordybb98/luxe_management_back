import { Permission } from '@prisma/client';

export class Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}
