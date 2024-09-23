export type Task = {
  id: string;
  instructions: string;
  technicianId: number;
  dateAssigned: Date;
  dateFinished?: Date;
  status: 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED';
};
