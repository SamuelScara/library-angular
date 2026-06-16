import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Author } from '../../../core/models/author.model';
import { Book } from '../../../core/models/book.model';
import { ProfileUpdateRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { AuthorService } from '../../../core/services/author.service';
import { AuthorFormComponent } from '../../authors/author-form/author-form.component';

@Component({
  selector: 'app-profile-author',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
  ],
  templateUrl: './profile-author.component.html',
  styleUrl: './profile-author.component.css',
})
export class ProfileAuthorComponent implements OnInit {
  private authService = inject(AuthService);
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  author: Author | null = null;
  books: Book[] = [];
  bookColumns = ['title', 'isbn', 'pubYear', 'availability'];

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
    const id = this.authService.currentUser$.value?.linkedAuthorId;
    if (!id) return;
    this.authorService.getById(id).subscribe((a) => (this.author = a));
    this.authorService.getBooks(id).subscribe((b) => (this.books = b));
  }

  openEditForm(): void {
    if (!this.author) return;
    this.dialog
      .open(AuthorFormComponent, { data: this.author })
      .afterClosed()
      .subscribe((result) => {
        if (!result || !this.author) return;
        this.authorService.update(this.author.id, result).subscribe({
          next: (updated) => {
            this.author = updated;
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
        this.successMsg = 'Account updated.';
        this.errorMsg = '';
        this.accountForm.patchValue({ currentPassword: '', newPassword: '' });
      },
      error: () => {
        this.errorMsg = 'Update failed. Check your current password.';
        this.successMsg = '';
      },
    });
  }
}
