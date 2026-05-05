import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Author } from '../../../core/models/author.model';

@Component({
  selector: 'app-author-form-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css',
})
export class AuthorFormComponent {
  dialogRef = inject(MatDialogRef<AuthorFormComponent>);
  private fb = inject(FormBuilder);
  data: Author | null = inject(MAT_DIALOG_DATA, { optional: true });

  form = this.fb.group({
    firstName: [this.data?.firstName ?? '', Validators.required],
    lastName: [this.data?.lastName ?? '', Validators.required],
    nationality: [this.data?.nationality ?? '', Validators.required],
  });

  get isEdit(): boolean {
    return !!this.data;
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
