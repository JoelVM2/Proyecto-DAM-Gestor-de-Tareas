import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard]
  }
];
