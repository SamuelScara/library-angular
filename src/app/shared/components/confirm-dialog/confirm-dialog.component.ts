import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title ?? 'Confirm deletion' }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">
        {{ data.confirmLabel ?? 'Delete' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  data: { message: string; title?: string; confirmLabel?: string } = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
}
