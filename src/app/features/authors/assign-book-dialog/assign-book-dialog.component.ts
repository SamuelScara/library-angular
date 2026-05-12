import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Author, BookSummary } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-assign-book-dialog.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './assign-book-dialog.component.html',
  styleUrl: './assign-book-dialog.component.css',
})
export class AssignBookDialogComponent implements OnInit {
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef);
  private changed = false;

  author: Author = inject(MAT_DIALOG_DATA);
  currentBooks: BookSummary[] = [...(this.author?.books ?? [])];
  availableBooks: BookSummary[] = [];
  searchControl = new FormControl('');

  get filteredBooks(): BookSummary[] {
    const q = (this.searchControl.value ?? '').toLowerCase().trim();
    if (!q) return this.availableBooks;
    return this.availableBooks.filter((b) => `${b.title}`.toLowerCase().includes(q));
  }

  ngOnInit(): void {
    this.authorService.getBooks(this.author.id).subscribe((currentBooks) => {
      this.currentBooks = currentBooks;
      const assignedIds = new Set(currentBooks.map((b) => b.id));
      this.bookService.getAll().subscribe((all) => {
        this.availableBooks = all.filter((b) => !assignedIds.has(b.id));
        this.cdr.detectChanges();
      });
    });
  }

  assignBook(book: BookSummary): void {
    this.bookService.assignAuthor(book.id, this.author.id).subscribe({
      next: () => {
        this.currentBooks = [...this.currentBooks, book];
        this.availableBooks = this.availableBooks.filter((b) => b.id !== book.id);
        this.changed = true;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Error assigning book', 'OK', { duration: 3000 }),
    });
  }

  unassignBook(book: BookSummary): void {
    this.bookService.unassignAuthor(book.id, this.author.id).subscribe({
      next: () => {
        this.currentBooks = this.currentBooks.filter((b) => b.id !== book.id);
        this.availableBooks = [...this.availableBooks, book];
        this.changed = true;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Error unassigning book', 'OK', { duration: 3000 }),
    });
  }

  close(): void {
    this.dialogRef.close(this.changed);
  }
}
