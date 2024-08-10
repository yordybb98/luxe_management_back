import { User } from '@prisma/client';

export class Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  status: string;
  userId: User;
}
