import { Role } from '@prisma/client';
import { Order } from './order';

export type PayloadToken = {
  sub: number;
  email: string;
  role: Role;
};
