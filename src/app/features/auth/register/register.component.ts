import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage = '';

  submit() {
    if (this.form.invalid) return;
    this.authService.register(this.form.value as RegisterRequest).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        if (err.status === 409) {
          const msg: string = err.error?.message ?? '';
          if (msg.toLowerCase().includes('username')) {
            this.form.get('username')!.setErrors({ taken: true });
          } else if (msg.toLowerCase().includes('email')) {
            this.form.get('email')!.setErrors({ taken: true });
          } else {
            this.errorMessage = 'Username or email already taken.';
          }
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
