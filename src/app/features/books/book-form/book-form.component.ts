import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-book-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent implements OnInit {
  dialogRef = inject(MatDialogRef<BookFormComponent>);
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  data: Book | null = inject(MAT_DIALOG_DATA, { optional: true });

  form = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],
    isbn: [this.data?.isbn ?? '', Validators.required],
    pubYear: [this.data?.pubYear ?? null, [Validators.required, Validators.min(1)]],
  });

  currentAuthors: Author[] = [...(this.data?.authors ?? [])];
  availableAuthors: Author[] = [];
  searchControl = new FormControl('');

  get isEdit(): boolean {
    return !!this.data;
  }

  ngOnInit(): void {
    const assignedIds = new Set(this.currentAuthors.map((a) => a.id));
    this.authorService.getAll().subscribe((authors) => {
      this.availableAuthors = authors.filter((a) => !assignedIds.has(a.id));
      this.cdr.detectChanges();
    });
  }

  assignAuthor(author: Author): void {
    if (this.isEdit) {
      this.bookService.assignAuthor(this.data!.id, author.id).subscribe({
        next: () => {
          this.currentAuthors = [...this.currentAuthors, author];
          this.availableAuthors = this.availableAuthors.filter((a) => a.id !== author.id);
          this.cdr.detectChanges();
        },
        error: () => this.snackBar.open('Error assigning author', 'OK', { duration: 3000 }),
      });
    } else {
      this.currentAuthors = [...this.currentAuthors, author];
      this.availableAuthors = this.availableAuthors.filter((a) => a.id !== author.id);
    }
  }

  removeAuthor(author: Author): void {
    if (this.isEdit) {
      this.bookService.unassignAuthor(this.data!.id, author.id).subscribe({
        next: () => {
          this.currentAuthors = this.currentAuthors.filter((a) => a.id !== author.id);
          this.availableAuthors = [...this.availableAuthors, author];
          this.cdr.detectChanges();
        },
        error: () => this.snackBar.open('Error removing author', 'OK', { duration: 3000 }),
      });
    } else {
      this.currentAuthors = this.currentAuthors.filter((a) => a.id !== author.id);
      this.availableAuthors = [...this.availableAuthors, author];
    }
  }

  get filteredAuthors(): Author[] {
    const q = (this.searchControl.value ?? '').toLowerCase().trim();
    if (!q) return this.availableAuthors;
    return this.availableAuthors.filter((a) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q),
    );
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        selectedAuthorIds: this.currentAuthors.map((a) => a.id),
      });
    }
  }
}
