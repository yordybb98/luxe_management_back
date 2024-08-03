import { User } from '@prisma/client';

export class Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  orderDescription: string;
  status: string;
  userAssigned: User;
}
