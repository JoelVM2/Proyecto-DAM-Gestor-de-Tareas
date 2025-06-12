export interface Task {
  id: number;
  title: string;
  description?: string;
  assignedTo?: number;
  columnId: number;
  dueDate?: string;
}
