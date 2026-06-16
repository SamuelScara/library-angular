import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProfileUpdateRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-info.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css',
})
export class ProfileInfoComponent implements OnInit {
  auth = inject(AuthService);

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.email]),
    currentPassword: new FormControl(''),
    newPassword: new FormControl('', [Validators.minLength(6)]),
  });

  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    const user = this.auth.currentUser$.value;

    if (user) {
      this.form.patchValue({ username: user.username, email: user.email });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const payload: ProfileUpdateRequest = {};
    const { username, email, currentPassword, newPassword } = this.form.value;

    if (username) payload.username = username;
    if (email) payload.email = email;
    if (currentPassword) payload.currentPassword = currentPassword;
    if (newPassword) payload.newPassword = newPassword;

    this.auth.updateProfile(payload).subscribe({
      next: () => {
        this.successMessage = 'Profile updated.';
        this.errorMessage = '';
        this.form.patchValue({ currentPassword: '', newPassword: '' });
      },
      error: () => {
        this.errorMessage = 'Update failed. Check your current password';
        this.successMessage = '';
      },
    });
  }
}
