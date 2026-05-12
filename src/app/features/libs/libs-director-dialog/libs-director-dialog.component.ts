import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Director } from '../../../core/models/director.model';
import { Lib } from '../../../core/models/lib.model';
import { DirectorService } from '../../../core/services/director.service';
import { LibService } from '../../../core/services/lib.service';

@Component({
  selector: 'app-libs-director-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatIconModule, MatButtonModule, NgFor, NgIf],
  templateUrl: './libs-director-dialog.component.html',
  styleUrl: './libs-director-dialog.component.css',
})
export class LibsDirectorDialogComponent implements OnInit {
  lib: Lib = inject(MAT_DIALOG_DATA);
  private directorService = inject(DirectorService);
  private libService = inject(LibService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef);

  directors: Director[] = [];
  pendingDirector: Director | null = null;

  ngOnInit(): void {
    this.directorService.getAll().subscribe((data) => {
      this.directors = data.filter((d) => d.libId !== this.lib.id);
      this.cdr.detectChanges();
    });
  }

  assign(director: Director): void {
    if (director.libId !== null && director.libId !== this.lib.id) {
      this.pendingDirector = director;
    } else {
      this.doAssign(director.id);
    }
  }

  confirmReassign(): void {
    if (this.pendingDirector) this.doAssign(this.pendingDirector.id);
  }

  cancelReassign(): void {
    this.pendingDirector = null;
  }

  private doAssign(directorId: number): void {
    this.libService.reassignToLib(this.lib.id, directorId).subscribe({
      next: () => {
        this.snackBar.open('Director assigned', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => this.snackBar.open('Error assigning director', 'OK', { duration: 3000 }),
    });
  }
}
