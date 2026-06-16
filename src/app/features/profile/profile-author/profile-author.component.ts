import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Author } from '../../../core/models/author.model';
import { Book } from '../../../core/models/book.model';
import { AuthService } from '../../../core/services/auth.service';
import { AuthorService } from '../../../core/services/author.service';
import { AuthorFormComponent } from '../../authors/author-form/author-form.component';

@Component({
  selector: 'app-profile-author',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatTableModule],
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

  ngOnInit(): void {
    this.load();
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
}
