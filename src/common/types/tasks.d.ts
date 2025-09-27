import { Image } from './image';

export type Task = {
  id: string;
  name?: string;
  instructions: string;
  assignedBy?: number;
  assignerName?: string;
  technicianName?: string;
  technicianId: number;
  dateAssigned: Date;
  previousTasks?: TaskSummary[];
  nextTasks?: TaskSummary[];
  isActive: boolean;
  updatedAt?: Date;
  dateFinished?: Date;
  cancelledBy?: string;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON HOLD';
};

export type TaskWithOrder = Task & {
  orderId: number;
  orderDirectory?: string;
  clientName?: string;
  orderImages?: Image[];
  orderDeadline?: string;
};

type TaskSummary = Pick<Task, 'id' | 'name' | 'status' | 'instructions'>;
