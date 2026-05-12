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
import { Author } from '../../../core/models/author.model';
import { Book } from '../../../core/models/book.model';
import { AuthorService } from '../../../core/services/author.service';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-assign-author-dialog.component',
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
  templateUrl: './assign-author-dialog.component.html',
  styleUrl: './assign-author-dialog.component.css',
})
export class AssignAuthorDialogComponent implements OnInit {
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef);
  private changed = false;

  book: Book = inject(MAT_DIALOG_DATA);
  currentAuthors: Author[] = [...(this.book?.authors ?? [])];
  availableAuthors: Author[] = [];
  searchControl = new FormControl('');

  get filteredAuthors(): Author[] {
    const q = (this.searchControl.value ?? '').toLowerCase().trim();
    if (!q) return this.availableAuthors;
    return this.availableAuthors.filter((a) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q),
    );
  }

  ngOnInit(): void {
    const assignedIds = new Set(this.currentAuthors.map((a) => a.id));
    this.authorService.getAll().subscribe((authors) => {
      this.availableAuthors = authors.filter((a) => !assignedIds.has(a.id));
      this.cdr.detectChanges();
    });
  }

  assignAuthor(author: Author): void {
    this.bookService.assignAuthor(this.book.id, author.id).subscribe({
      next: () => {
        this.currentAuthors = [...this.currentAuthors, author];
        this.availableAuthors = this.availableAuthors.filter((a) => a.id !== author.id);
        this.changed = true;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Error assigning author', 'OK', { duration: 3000 }),
    });
  }

  removeAuthor(author: Author): void {
    this.bookService.unassignAuthor(this.book.id, author.id).subscribe({
      next: () => {
        this.currentAuthors = this.currentAuthors.filter((a) => a.id !== author.id);
        this.availableAuthors = [...this.availableAuthors, author];
        this.changed = true;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Error removing author', 'OK', { duration: 3000 }),
    });
  }

  close(): void {
    this.dialogRef.close(this.changed);
  }
}
