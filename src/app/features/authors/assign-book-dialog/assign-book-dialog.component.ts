import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignBookDialogComponent implements OnInit {
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);
  private cdr = inject(ChangeDetectorRef);

  author: Author = inject(MAT_DIALOG_DATA);
  currentBooks: BookSummary[] = [];
  availableBooks: BookSummary[] = [];
  searchControl = new FormControl('');

  pendingAdd: BookSummary[] = [];
  pendingRemove: BookSummary[] = [];

  get hasPendingChanges(): boolean {
    return this.pendingAdd.length > 0 || this.pendingRemove.length > 0;
  }

  get filteredBooks(): BookSummary[] {
    const q = (this.searchControl.value ?? '').toLowerCase().trim();
    if (!q) return this.availableBooks;
    return this.availableBooks.filter((b) => b.title.toLowerCase().includes(q));
  }

  ngOnInit(): void {
    forkJoin({
      current: this.authorService.getBooks(this.author.id),
      all: this.bookService.getAllList(),
    }).subscribe(({ current, all }) => {
      const assignedIds = new Set(current.map((b) => b.id));
      this.currentBooks = current;
      this.availableBooks = all.filter((b) => !assignedIds.has(b.id));
      this.cdr.markForCheck();
    });
  }

  stageAdd(book: BookSummary): void {
    this.pendingRemove = this.pendingRemove.filter((b) => b.id !== book.id);
    if (!this.pendingAdd.find((b) => b.id === book.id)) {
      this.pendingAdd = [...this.pendingAdd, book];
    }
    this.currentBooks = [...this.currentBooks, book];
    this.availableBooks = this.availableBooks.filter((b) => b.id !== book.id);
  }

  stageRemove(book: BookSummary): void {
    this.pendingAdd = this.pendingAdd.filter((b) => b.id !== book.id);
    if (!this.pendingRemove.find((b) => b.id === book.id)) {
      this.pendingRemove = [...this.pendingRemove, book];
    }
    this.currentBooks = this.currentBooks.filter((b) => b.id !== book.id);
    this.availableBooks = [...this.availableBooks, book];
  }

  save(): void {
    const calls = [
      ...this.pendingAdd.map((b) => this.bookService.assignAuthor(b.id, this.author.id)),
      ...this.pendingRemove.map((b) => this.bookService.unassignAuthor(b.id, this.author.id)),
    ];
    forkJoin(calls).subscribe({
      next: () => {
        this.snackBar.open('Books updated', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Error saving changes', 'OK', { duration: 3000 }),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
