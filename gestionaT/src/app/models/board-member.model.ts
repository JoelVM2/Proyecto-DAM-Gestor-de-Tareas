import { User } from './user.model';

export interface BoardMember {
  id: number;
  boardId: number;
  userId: number;
  user?: User;
}
