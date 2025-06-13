import { Column } from './column.model';
import { User }   from './user.model';

export interface Board {
  id: number;
  name: string;
  ownerId?: number;
  columns: Column[];
  members: User[]| { $values: User[] };
}
