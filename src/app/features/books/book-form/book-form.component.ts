import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent {
  dialogRef = inject(MatDialogRef<BookFormComponent>);
  private fb = inject(FormBuilder);
  data: Book | null = inject(MAT_DIALOG_DATA, { optional: true });

  form = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],
    isbn: [this.data?.isbn ?? '', Validators.required],
    pubYear: [this.data?.pubYear ?? null, [Validators.required, Validators.min(1)]],
  });

  get isEdit(): boolean {
    return !!this.data;
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
