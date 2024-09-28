import { User } from '@prisma/client';
import { Task } from './tasks';
import { Stage } from './stage';

export type Order = {
  id: number;
  name: string;
  description: string;
  techniciansAssigned?: User[];
  techniciansAssignedId?: number[];
  stage: Stage;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  website: string;
  comments: string;
  designersAssigned?: User[];
  designersAssignedIds: number[];
  tasks?: Task[];
  directory: string;
};
