import { Role, User } from '@prisma/client';

export class Permission {
  id: number;
  name: string;
  description: string;
  users: User[];
  roles: Role[];
}
