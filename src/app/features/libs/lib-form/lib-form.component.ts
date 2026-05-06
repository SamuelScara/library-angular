import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Lib } from '../../../core/models/lib.model';

@Component({
  selector: 'app-lib-form.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './lib-form.component.html',
  styleUrl: './lib-form.component.css',
})
export class LibFormComponent {
  dialogRef = inject(MatDialogRef<LibFormComponent>);
  private fb = inject(FormBuilder);
  data: Lib | null = inject(MAT_DIALOG_DATA, { optional: true }); // MAT_DIALOG_DATA contains the current lib object |||||| data is null on creation - Lib object on edit

  form = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],
    city: [this.data?.city ?? '', Validators.required],
    address: [this.data?.address ?? '', Validators.required],
  });

  get isEdit(): boolean {
    return !!this.data;
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
