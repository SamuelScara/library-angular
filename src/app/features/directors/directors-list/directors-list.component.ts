import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Director } from '../../../core/models/director.model';
import { DirectorService } from '../../../core/services/director.service';
import { DirectorLibsDialogComponent } from '../director-libs-dialog/director-libs-dialog.component';
import { DirectorsFormComponent } from '../directors-form/directors-form.component';

@Component({
  selector: 'app-directors-list.component',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule, NgIf],
  templateUrl: './directors-list.component.html',
  styleUrl: './directors-list.component.css',
})
export class DirectorsListComponent implements OnInit {
  private directorService = inject(DirectorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  directors: Director[] = [];
  columns = ['firstName', 'lastName', 'email', 'actions'];
  expandedDirector: Director | null = null;

  toggleExpand(director: Director): void {
    if (this.expandedDirector === director) {
      this.expandedDirector = null;
      return;
    }
    this.expandedDirector = director;
    if (director.libId && director.lib === undefined) {
      this.directorService.getLib(director.id).subscribe({
        next: (lib) => {
          director.lib = lib;
          this.cdr.detectChanges();
        },
        error: () => {
          director.lib = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.directorService.getAll().subscribe((data) => {
      this.directors = data;
      this.cdr.detectChanges();
    });
  }

  openForm() {
    this.dialog
      .open(DirectorsFormComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.directorService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Director saved', 'OK', { duration: 3000 });
            },
          });
        }
      });
  }

  openEditForm(director: Director) {
    this.dialog
      .open(DirectorsFormComponent, { data: director })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.directorService.update(director.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Director has been updated', 'OK', { duration: 3000 });
            },
          });
        }
      });
  }

  openAssignLibDialog(director: Director) {
    this.dialog
      .open(DirectorLibsDialogComponent, { data: director })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          director.lib = undefined;
          this.load();
        }
      });
  }

  delete(directorId: number) {
    this.directorService.delete(directorId).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Director deleted', 'OK', { duration: 3000 });
      },
    });
  }
}
