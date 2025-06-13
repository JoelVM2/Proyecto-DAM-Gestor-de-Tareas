import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardMember } from '../../models/board-member.model';

export interface InviteDto {
  boardId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BoardMembersService {
  private readonly baseUrl = 'http://localhost:5016/api/boardmembers';

  constructor(private http: HttpClient) {}

  inviteUserToBoard(dto: InviteDto): Observable<BoardMember> {
    return this.http.post<BoardMember>(this.baseUrl, dto);
  }

  getMembersByBoard(boardId: number): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(`${this.baseUrl}/board/${boardId}`);
  }

  removeMember(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${memberId}`);
  }

  getInvitations(userId: number): Observable<{ id: number; boardName: string }[]> {
    return this.http.get<{ id: number; boardName: string }[]>(`${this.baseUrl}/invitations/${userId}`);
  }

  acceptInvitation(invitationId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${invitationId}/accept/${userId}`, {});
  }

  rejectInvitation(invitationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${invitationId}`);
  }  
}
