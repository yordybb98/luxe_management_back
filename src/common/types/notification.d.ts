export type Notification = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  source?: string;
};
