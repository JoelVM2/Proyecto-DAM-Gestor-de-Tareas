import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: 'member'
    };

    this.authService.register(newUser).subscribe({
      next: (res: any) => {
        console.log('Usuario registrado:', res);
        this.authService.login(JSON.stringify({
          id: res.id,
          username: res.username
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 409) {
          form.controls['username']?.setErrors({ userExists: true });
        } else {
          this.error = 'Error al registrar. Inténtalo más tarde.';
          console.error(err);
        }
      }
    });
  }
}
