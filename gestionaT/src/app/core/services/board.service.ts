import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Board } from '../../models/board.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = 'http://localhost:5016/api/boards';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  getBoardsForCurrentUser(): Observable<Board[]> {
    const user = this.auth.getCurrentUser();
    if (!user || !user.id) {
      return of([]);
    }

    return this.http.get<{ $values: Board[] }>(`${this.apiUrl}/mine/${user.id}`)
      .pipe(
        map(response => response.$values || [])
      );
  }

  getBoardForUser(boardId: number): Observable<Board> {
    const user = this.auth.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Usuario no autenticado');
    }

    return this.http.get<Board>(`${this.apiUrl}/details/${boardId}/user/${user.id}`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, board);
  }

  updateBoard(id: number, board: Board): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, board);
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  rejectBoardInvitation(boardId: number): Observable<void> {
    const user = this.auth.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Usuario no autenticado');
    }
    return this.http.delete<void>(`${this.apiUrl}/${boardId}/reject/${user.id}`);
  }

}
