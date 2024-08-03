import { Client, User } from '@prisma/client';

export class Project {
  id: number;
  name: string;
  description: string;
  users: User[];
  client: Client;
}
