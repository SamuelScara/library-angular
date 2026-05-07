import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Director } from '../../../core/models/director.model';
import { Lib } from '../../../core/models/lib.model';
import { LibService } from '../../../core/services/lib.service';

@Component({
  selector: 'app-director-libs-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatIconModule, MatButtonModule, NgFor, NgIf],
  templateUrl: './director-libs-dialog.component.html',
  styleUrl: './director-libs-dialog.component.css',
})
export class DirectorLibsDialogComponent implements OnInit {
  director: Director = inject(MAT_DIALOG_DATA);
  private libService = inject(LibService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);
  private cdr = inject(ChangeDetectorRef);

  libs: Lib[] = [];
  pendingLib: Lib | null = null;
  columns = ['name', 'city', 'address'];

  ngOnInit(): void {
    this.libService.getAll().subscribe((data) => {
      this.libs = data;
      this.cdr.detectChanges();
    });
  }

  assign(lib: Lib): void {
    if (lib.director && lib.director.id !== this.director.id) {
      this.pendingLib = lib;
    } else {
      this.doAssign(lib.id);
    }
  }

  confirmReassign(): void {
    if (this.pendingLib) this.doAssign(this.pendingLib.id);
  }

  cancelReassign(): void {
    this.pendingLib = null;
  }

  private doAssign(libId: number): void {
    this.libService.reassignToLib(libId, this.director.id).subscribe({
      next: () => {
        this.snackBar.open('Library assigned', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Error assigning library', 'OK', { duration: 3000 }),
    });
  }
}
