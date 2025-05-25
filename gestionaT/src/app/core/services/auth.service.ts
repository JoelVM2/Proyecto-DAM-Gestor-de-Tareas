import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'auth_token';

  constructor() { }

  login(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getUserInfo() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    //TO DO informacion de usuario
    return { token };
  }
}