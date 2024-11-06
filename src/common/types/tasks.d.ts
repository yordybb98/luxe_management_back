export type Task = {
  id: string;
  name?: string;
  instructions: string;
  assignedBy?: number;
  technicianId: number;
  dateAssigned: Date;
  previousTasks?: TaskSummary[];
  nextTasks?: TaskSummary[];
  isActive: boolean;
  updatedAt?: Date;
  dateFinished?: Date;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON HOLD';
};

type TaskSummary = Pick<Task, 'id' | 'name' | 'status'>;
