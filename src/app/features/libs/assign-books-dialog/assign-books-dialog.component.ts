import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignBooksDialogComponent implements OnInit {
  private bookService = inject(BookService);
  private libService = inject(LibService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);
  private cdr = inject(ChangeDetectorRef);

  lib: Lib = inject(MAT_DIALOG_DATA);
  availableBooks: Book[] = [];
  stagedBooks: Book[] = [];

  get hasPendingChanges(): boolean {
    return this.stagedBooks.length > 0;
  }

  ngOnInit(): void {
    const assignedIds = new Set(this.lib.books.map((b) => b.id));
    this.bookService.getAllList().subscribe((books) => {
      this.availableBooks = books.filter((b) => !assignedIds.has(b.id));
      this.cdr.markForCheck();
    });
  }

  stageBook(book: Book): void {
    this.stagedBooks = [...this.stagedBooks, book];
    this.availableBooks = this.availableBooks.filter((b) => b.id !== book.id);
  }

  unstageBook(book: Book): void {
    this.stagedBooks = this.stagedBooks.filter((b) => b.id !== book.id);
    this.availableBooks = [...this.availableBooks, book];
  }

  save(): void {
    forkJoin(this.stagedBooks.map((b) => this.libService.assignBook(this.lib.id, b.id))).subscribe({
      next: () => {
        this.snackBar.open('Books assigned', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Error assigning books', 'OK', { duration: 3000 }),
    });
  }
}
