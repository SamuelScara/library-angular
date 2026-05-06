import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgFor, NgIf } from '@angular/common';
import { Lib } from '../../../core/models/lib.model';
import { LibService } from '../../../core/services/lib.service';
import { LibFormComponent } from '../lib-form/lib-form.component';

@Component({
  selector: 'app-lib-list.component',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, MatButtonModule, MatIconModule, MatToolbarModule, NgFor, NgIf],
  templateUrl: './lib-list.component.html',
  styleUrl: './lib-list.component.css',
})
export class LibListComponent implements OnInit {
  private libService = inject(LibService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  libs: Lib[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.libService.getAll().subscribe((data) => {
      this.libs = data;
      this.cdr.markForCheck();
    });
  }

  openForm() {
    this.dialog
      .open(LibFormComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.libService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Library saved', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to save', 'OK', { duration: 3000 }),
          });
        }
      });
  }

  openEditForm(lib: Lib) {
    this.dialog
      .open(LibFormComponent, { data: lib })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.libService.update(lib.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Library has been edited', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to update the library', 'OK', {
                duration: 3000,
              }),
          });
        }
      });
  }

  delete(id: number) {
    this.libService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Library deleted', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('An error occured while trying to delete', 'OK', { duration: 3000 }),
    });
  }
}
