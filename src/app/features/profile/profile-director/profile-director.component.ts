import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Director } from '../../../core/models/director.model';
import { Lib } from '../../../core/models/lib.model';
import { ProfileUpdateRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { DirectorService } from '../../../core/services/director.service';
import { DirectorsFormComponent } from '../../directors/directors-form/directors-form.component';

@Component({
  selector: 'app-profile-director',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
  ],
  templateUrl: './profile-director.component.html',
  styleUrl: './profile-director.component.css',
})
export class ProfileDirectorComponent implements OnInit {
  private authService = inject(AuthService);
  private directorService = inject(DirectorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  director: Director | null = null;
  lib: Lib | null = null;

  accountForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    currentPassword: new FormControl(''),
    newPassword: new FormControl('', [Validators.minLength(6)]),
  });
  successMsg = '';
  errorMsg = '';

  ngOnInit(): void {
    this.load();
    const user = this.authService.currentUser$.value;
    if (user) this.accountForm.patchValue({ email: user.email });
  }

  private load(): void {
    const id = this.authService.currentUser$.value?.linkedDirectorId;
    if (!id) return;
    this.directorService.getById(id).subscribe((d) => {
      this.director = d;
      if (d.libId) {
        this.directorService.getLib(id).subscribe((l) => (this.lib = l));
      }
    });
  }

  openEditForm(): void {
    if (!this.director) return;
    this.dialog
      .open(DirectorsFormComponent, { data: this.director })
      .afterClosed()
      .subscribe((result) => {
        if (!result || !this.director) return;
        this.directorService.update(this.director.id, result).subscribe({
          next: (updated) => {
            this.director = updated;
            this.snackBar.open('Profile updated', 'OK', { duration: 3000 });
          },
        });
      });
  }

  submitAccount(): void {
    const { email, currentPassword, newPassword } = this.accountForm.value;
    const payload: ProfileUpdateRequest = {};

    if (email) payload.email = email;
    if (currentPassword) payload.currentPassword = currentPassword;
    if (newPassword) payload.newPassword = newPassword;

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.successMsg = 'Account updated';
        this.errorMsg = '';
        this.accountForm.patchValue({ currentPassword: '', newPassword: '' });
      },
      error: () => {
        this.errorMsg = 'Update failed. Check your current password';
        this.successMsg = '';
      },
    });
  }
}
