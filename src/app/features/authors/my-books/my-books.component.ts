import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Author, BookSummary } from '../../../core/models/author.model';
import { AuthService } from '../../../core/services/auth.service';
import { AuthorService } from '../../../core/services/author.service';
import { BookService } from '../../../core/services/book.service';
import { BookInfoDialogComponent } from '../../books/book-info-dialog/book-info-dialog.component';
import { AssignBookDialogComponent } from '../assign-book-dialog/assign-book-dialog.component';

@Component({
  selector: 'app-my-books.component',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatAccordion,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.css',
})
export class MyBooksComponent implements OnInit {
  private authService = inject(AuthService);
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  author: Author | null = null;
  notAssigned = false;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = this.authService.currentUser$.value?.linkedAuthorId;
    if (!id) {
      this.notAssigned = true;
      return;
    }
    this.authorService.getById(id).subscribe({
      next: (a) => (this.author = a),
      error: () => (this.notAssigned = true),
    });
  }

  openManageBooksDialog(): void {
    if (!this.author) return;
    this.dialog
      .open(AssignBookDialogComponent, { data: this.author, width: '500px' })
      .afterClosed()
      .subscribe(() => this.load());
  }

  openBookInfoDialog(book: BookSummary): void {
    this.bookService.getById(book.id).subscribe({
      next: (b) => this.dialog.open(BookInfoDialogComponent, { data: b, width: '600px' }),
    });
  }

  unassignBook(bookId: number): void {
    if (!this.author) return;
    this.bookService.unassignAuthor(bookId, this.author.id).subscribe({
      next: () => {
        this.author!.books = this.author!.books.filter((b) => b.id !== bookId);
        this.snackBar.open('Book unassigned', 'OK', { duration: 3000 });
      },
    });
  }
}
