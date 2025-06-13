import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  token?: string;
  id?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'auth_token';
  private apiUrl   = 'http://localhost:5016/api/auth';

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  register(user: { username: string; email: string; password: string; role: string }) {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(rawTokenOrPayload: string) {
    localStorage.setItem(this.TOKEN_KEY, rawTokenOrPayload);
    this.loggedIn$.next(true);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn$.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  isLoggedInObservable(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  loginWithBackend(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => {
        if (res.token) {
          this.login(res.token);
        } else if (res.id != null && res.username) {
          this.login(JSON.stringify({ id: res.id, username: res.username }));
        }
      }));
  }

  getCurrentUser(): { id: number; username: string } | null {
    const raw = localStorage.getItem(this.TOKEN_KEY);
    if (!raw) return null;

    if (raw.trim().startsWith('{')) {
      try {
        const obj = JSON.parse(raw) as { id: number; username: string };
        if (typeof obj.id === 'number' && typeof obj.username === 'string') {
          return obj;
        }
        return null;
      } catch {
        return null;
      }
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      console.error('Token inválido, ni JSON ni JWT:', raw);
      return null;
    }
    try {
      const payloadJson = this.base64UrlDecode(parts[1]);
      const payload     = JSON.parse(payloadJson) as any;
      if (typeof payload.id === 'number' && typeof payload.username === 'string') {
        return { id: payload.id, username: payload.username };
      }
      return null;
    } catch (e) {
      console.error('Error decodificando JWT:', e);
      return null;
    }
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) { str += '='; }
    return atob(str);
  }
}
