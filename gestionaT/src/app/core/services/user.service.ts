import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

export interface Invitation {
  boardId: number;
  boardName: string;
  isInvitationPending: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5016/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }  

  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserInvitations(userId: number): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrl}/${userId}/invitations`);
  }
  
  respondToInvitation(boardId: number, accept: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitations/${boardId}/response`, { accept });
  }
  
}
