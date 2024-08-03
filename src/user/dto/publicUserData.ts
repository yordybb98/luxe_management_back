import { Department, Role } from '@prisma/client';

export class PublicUserData {
  name: string;
  username: string;
  email: string;
  departmentId: number;
  roleId: number;
}
