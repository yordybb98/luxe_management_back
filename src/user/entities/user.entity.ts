import { Permission, Role } from '@prisma/client';
import { Order } from 'src/common/types/order';

export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  orders: Order[];
  permissions: Permission[];
}
