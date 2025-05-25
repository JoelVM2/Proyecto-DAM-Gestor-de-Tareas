import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';  // IMPORTA NgIf
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Aquí iría la llamada real a backend. Vamos a simularlo:
    if (this.email === 'test@example.com' && this.password === '1234') {
      const fakeToken = 'eyJhbGciOi...'; // Un JWT válido de prueba o string cualquiera
      this.authService.login(fakeToken);
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Email o contraseña incorrectos';
    }
  }
}