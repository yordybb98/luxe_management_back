import { User } from '@prisma/client';
import { Status } from './stage';
import { Task } from './tasks';

export type Order = {
  id: number;
  name: string;
  description: string;
  userAssigned?: User[];
  techniciansAssignedId?: number[];
  status: Status;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  website: string;
  comments: string;
  designersAssignedIds: number[];
  tasks?: Task[];
  directory: string;
};
