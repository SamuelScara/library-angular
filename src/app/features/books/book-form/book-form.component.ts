import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-book-form',
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

  form = this.fb.group({
    title: ['', Validators.required],
    isbn: ['', Validators.required],
    pubYear: [null, [Validators.required, Validators.min(1)]],
  });

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
