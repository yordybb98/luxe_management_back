import { User } from '@prisma/client';
import { Status } from './stage';

export type Order = {
  id: number;
  name: string;
  description: string;
  userAssigned?: User;
  userAssignedId?: number;
  status: Status;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  website: string;
  comments: string;
  designerId: number;
};
