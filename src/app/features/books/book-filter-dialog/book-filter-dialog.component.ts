import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BookFilters } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-filter-dialog.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './book-filter-dialog.component.html',
  styleUrl: './book-filter-dialog.component.css',
})
export class BookFilterDialogComponent {
  private dialogRef = inject(MatDialogRef<BookFilterDialogComponent>);
  private data: BookFilters = inject(MAT_DIALOG_DATA) ?? {};

  form = new FormGroup({
    yearFrom: new FormControl<number | null>(this.data.yearFrom ?? null),
    yearTo: new FormControl<number | null>(this.data.yearTo ?? null),
    availability: new FormControl<boolean | null>(this.data.availability ?? null),
    authorName: new FormControl(this.data.authorName ?? ''),
  });

  apply() {
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }

  clear() {
    this.dialogRef.close({});
  }
}
