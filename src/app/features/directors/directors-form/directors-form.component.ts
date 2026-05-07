import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Director } from '../../../core/models/director.model';

@Component({
  selector: 'app-directors-form.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './directors-form.component.html',
  styleUrl: './directors-form.component.css',
})
export class DirectorsFormComponent {
  dialogRef = inject(MatDialogRef<DirectorsFormComponent>);
  private fb = inject(FormBuilder);
  data: Director | null = inject(MAT_DIALOG_DATA, { optional: true });

  form = this.fb.group({
    firstName: [this.data?.firstName ?? '', Validators.required],
    lastName: [this.data?.lastName ?? '', Validators.required],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
  });

  get isEdit(): boolean {
    return !!this.data;
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
