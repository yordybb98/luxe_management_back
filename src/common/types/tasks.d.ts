export type Task = {
  id: string;
  instructions: string;
  technicianId: number;
  dateAssigned: Date;
  updatedAt?: Date;
  dateFinished?: Date;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED';
};
