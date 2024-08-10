import { User } from '@prisma/client';

export class Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  statusId: number;
  userId: number;
}
