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
import { forkJoin } from 'rxjs';
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

  book: Book = inject(MAT_DIALOG_DATA);
  currentAuthors: Author[] = [...(this.book?.authors ?? [])];
  availableAuthors: Author[] = [];
  searchControl = new FormControl('');

  pendingAdd: Author[] = [];
  pendingRemove: Author[] = [];

  get hasPendingChanges(): boolean {
    return this.pendingAdd.length > 0 || this.pendingRemove.length > 0;
  }

  get filteredAuthors(): Author[] {
    const q = (this.searchControl.value ?? '').toLowerCase().trim();
    if (!q) return this.availableAuthors;
    return this.availableAuthors.filter((a) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q),
    );
  }

  ngOnInit(): void {
    // reload book from API to get an up-to-date author list and avoid duplicates
    this.bookService.getById(this.book.id).subscribe((freshBook) => {
      this.currentAuthors = freshBook.authors ?? [];
      const assignedIds = new Set(this.currentAuthors.map((a) => a.id));
      this.authorService.getAllList().subscribe((all) => {
        this.availableAuthors = all.filter((a) => !assignedIds.has(a.id));
        this.cdr.detectChanges();
      });
    });
  }

  stageAdd(author: Author): void {
    this.pendingRemove = this.pendingRemove.filter((a) => a.id !== author.id);
    if (!this.pendingAdd.find((a) => a.id === author.id)) {
      this.pendingAdd = [...this.pendingAdd, author];
    }
    this.currentAuthors = [...this.currentAuthors, author];
    this.availableAuthors = this.availableAuthors.filter((a) => a.id !== author.id);
    this.cdr.detectChanges();
  }

  stageRemove(author: Author): void {
    this.pendingAdd = this.pendingAdd.filter((a) => a.id !== author.id);
    if (!this.pendingRemove.find((a) => a.id === author.id)) {
      this.pendingRemove = [...this.pendingRemove, author];
    }
    this.currentAuthors = this.currentAuthors.filter((a) => a.id !== author.id);
    this.availableAuthors = [...this.availableAuthors, author];
    this.cdr.detectChanges();
  }

  save(): void {
    const calls = [
      ...this.pendingAdd.map((a) => this.bookService.assignAuthor(this.book.id, a.id)),
      ...this.pendingRemove.map((a) => this.bookService.unassignAuthor(this.book.id, a.id)),
    ];
    forkJoin(calls).subscribe({
      next: () => {
        this.snackBar.open('Authors updated', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Error saving changes', 'OK', { duration: 3000 }),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
