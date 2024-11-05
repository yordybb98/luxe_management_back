export type Task = {
  id: string;
  name?: string;
  instructions: string;
  assignedBy?: number;
  technicianId: number;
  dateAssigned: Date;
  previousTasks?: string[];
  nextTasks?: string[];
  isActive: boolean;
  updatedAt?: Date;
  dateFinished?: Date;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON HOLD';
};
