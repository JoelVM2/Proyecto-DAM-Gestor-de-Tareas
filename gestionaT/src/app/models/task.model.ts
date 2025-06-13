export interface Task {
  id?: number;
  title: string;
  description?: string;
  assignedTo?: number | null;
  columnId: number;
  dueDate?: string;
}
