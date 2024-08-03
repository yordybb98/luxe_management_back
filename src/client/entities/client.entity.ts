import { Project } from '@prisma/client';

export class Client {
  id: number;
  name: string;
  description: string;
  email: string;
  mailing: string;
  phone: string;
  address: string;
  projects: Project[];
}
