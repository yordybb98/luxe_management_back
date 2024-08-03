import { User } from '@prisma/client';

export class Department {
  id: number;
  name: string;
  users: User[];
}
