import { BoardMember } from './board-member.model';
import { Column } from './column.model';
import { User } from './user.model';

export interface Board {
  id: number;
  name: string;
  ownerId?: number;
  owner?: User;
  createdAt: string;
  columns?: Column[];
  members?: BoardMember[];
}
