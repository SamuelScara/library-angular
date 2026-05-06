import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '../../../core/models/book.model';
import { Lib } from '../../../core/models/lib.model';
import { BookService } from '../../../core/services/book.service';
import { LibService } from '../../../core/services/lib.service';

@Component({
  selector: 'app-assign-books-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatButtonModule, MatIconModule, NgFor, NgIf],
  templateUrl: './assign-books-dialog.component.html',
  styleUrl: './assign-books-dialog.component.css',
})
export class AssignBooksDialogComponent implements OnInit {
  private bookService = inject(BookService);
  private libService = inject(LibService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);
  private cdr = inject(ChangeDetectorRef);

  lib: Lib = inject(MAT_DIALOG_DATA);
  availableBooks: Book[] = [];

  ngOnInit(): void {
    const assignedIds = new Set(this.lib.books.map((b) => b.id));
    this.bookService.getAll().subscribe((books) => {
      this.availableBooks = books.filter((b) => !assignedIds.has(b.id));
      this.cdr.detectChanges();
    });
  }

  assign(book: Book): void {
    this.libService.assignBook(this.lib.id, book.id).subscribe({
      next: () => {
        this.availableBooks = this.availableBooks.filter((b) => b.id !== book.id);
        this.cdr.detectChanges();
        this.snackBar.open(`"${book.title}" assigned`, 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('An error occured while assigning the book', 'OK', { duration: 3000 }),
    });
  }
}
