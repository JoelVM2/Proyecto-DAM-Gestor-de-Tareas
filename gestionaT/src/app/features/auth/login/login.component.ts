import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.authService.loginWithBackend(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.authService.login('ok');
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Email o contraseña incorrectos';
        }
      },
      error: (err) => {
        this.error = 'Error al conectar con el servidor';
        console.error(err);
      }
    });
  }
}
