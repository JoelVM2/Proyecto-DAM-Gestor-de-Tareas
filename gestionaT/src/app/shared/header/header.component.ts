import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BoardService } from '../../core/services/board.service';
import { BoardMembersService } from '../../core/services/boardMember.service';
import { Board } from '../../models/board.model';
import { BoardsResponse } from '../../models/boards-response.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  inviteUsername = '';
  inviteResult = '';
  boards: Board[] = [];
  selectedBoardId!: number;
  invitations: { id: number; boardName: string }[] = [];
  userId: number | null = null;

  constructor(
    public authService: AuthService,
    private boardService: BoardService,
    private boardMembersService: BoardMembersService,
    private userService: UserService

  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userId = user ? user.id : null;
    this.loadMyBoards();
    this.loadMyInvitations();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }

  loadMyBoards() {
    this.boardService.getBoardsForCurrentUser().subscribe({
      next: (boards: Board[]) => {
        this.boards = boards;
        console.log('Boards recibidos:', this.boards);
      },
      error: (err: any) => console.error('No pude cargar tableros', err)
    });
  }

  async onInvite() {
    if (!this.inviteUsername.trim() || !this.selectedBoardId) return;
  
    try {
      const users = await this.userService.getUsers().toPromise();
      const user = users?.find(u => u.username === this.inviteUsername.trim());
      if (!user) {
        this.inviteResult = `Usuario no encontrado: ${this.inviteUsername}`;
        return;
      }
      await this.boardMembersService.inviteUserToBoard({
        boardId: this.selectedBoardId,
        userId: user.id
      }).toPromise();
      this.inviteResult = `Invitación enviada a ${this.inviteUsername}`;
      this.inviteUsername = '';
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        this.inviteResult = `Error: ${err.message}`;
      } else {
        this.inviteResult = 'Error: no se pudo invitar';
      }
    }
  }
  

  loadMyInvitations() {
    if (this.userId === null) {
      console.warn('No userId disponible para cargar invitaciones');
      return;
    }
    this.boardMembersService.getInvitations(this.userId).subscribe({
      next: (data) => this.invitations = data,
      error: (err) => console.error('Error al cargar invitaciones', err)
    });
  }
  
  acceptInvitation(id: number) {
    if (this.userId === null) {
      console.warn('No userId disponible para aceptar invitación');
      return;
    }
    this.boardMembersService.acceptInvitation(id, this.userId).subscribe({
      next: () => this.loadMyInvitations(),
      error: (err) => console.error('Error al aceptar invitación', err)
    });
  }  

  rejectInvitation(id: number) {
    this.boardMembersService.rejectInvitation(id).subscribe({
      next: () => this.loadMyInvitations(),
      error: (err) => console.error('Error al rechazar invitación', err)
    });
  }  

  private getUserIdByUsername(username: string): number {
    return 0;
  }
}
