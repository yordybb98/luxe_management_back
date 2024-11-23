import { Role } from '@prisma/client';
import { Order } from './order';

export type PayloadToken = {
  sub: number;
  username: string;
  email: string;
  role: Role;
};
