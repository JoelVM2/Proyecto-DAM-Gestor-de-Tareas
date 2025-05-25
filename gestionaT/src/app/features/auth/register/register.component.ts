import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';   // IMPORTA NgIf
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (this.username.toLowerCase() === 'testuser') {
      form.controls['username'].setErrors({ userExists: true });
      this.error = '';
      return;
    }

    // Si todo va bien, borramos errores y seguimos
    form.controls['username'].setErrors(null);
    this.error = '';

    // Simular registro correcto:
    const token = 'token-prueba';
    this.authService.login(token);
    this.router.navigate(['/dashboard']);
  }
}
