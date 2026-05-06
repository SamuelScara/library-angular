import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Exhibition } from '../../../core/models/exhibition.model';
import { ExhibitionService } from '../../../core/services/exhibition.service';
import { ExhibitionFormComponent } from '../exhibition-form/exhibition-form.component';
import { SimulationResultDialogComponent } from '../simulation-result-dialog/simulation-result-dialog.component';

@Component({
  selector: 'app-exhibition-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule, DatePipe],
  templateUrl: './exhibition-list.component.html',
  styleUrl: './exhibition-list.component.css',
})
export class ExhibitionListComponent implements OnInit {
  private exhibitionService = inject(ExhibitionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  exhibitions: Exhibition[] = [];
  columns = ['title', 'libId', 'startDate', 'endDate', 'simulationDate', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.exhibitionService.getAll().subscribe((data) => {
      this.exhibitions = data;
      this.cdr.markForCheck();
    });
  }

  openForm(): void {
    this.dialog
      .open(ExhibitionFormComponent, { width: '550px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.exhibitionService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Exhibition created', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('Error creating exhibition', 'OK', { duration: 3000 }),
          });
        }
      });
  }

  openEditForm(exhibition: Exhibition): void {
    this.dialog
      .open(ExhibitionFormComponent, { data: exhibition, width: '550px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.exhibitionService.update(exhibition.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Exhibition updated', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('Error updating exhibition', 'OK', { duration: 3000 }),
          });
        }
      });
  }

  delete(id: number): void {
    this.exhibitionService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Exhibition deleted', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error deleting exhibition', 'OK', { duration: 3000 }),
    });
  }

  simulate(exhibition: Exhibition): void {
    this.exhibitionService.simulate(exhibition.id).subscribe({
      next: (result) => {
        this.load();
        this.dialog.open(SimulationResultDialogComponent, { data: result, width: '600px' });
      },
      error: () => this.snackBar.open('Error running simulation', 'OK', { duration: 3000 }),
    });
  }
}
