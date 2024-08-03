import { Department, Order, Permission, Project, Role } from '@prisma/client';

export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  orders: Order[];
  department: Department;
  projects: Project[];
  permissions: Permission[];
}
