export type Task = {
  id: string;
  instructions: string;
  assignedBy?: number;
  technicianId: number;
  dateAssigned: Date;
  parentTasksIds?: Task[];
  isActive: boolean;
  updatedAt?: Date;
  dateFinished?: Date;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED';
};
