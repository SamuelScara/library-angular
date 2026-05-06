import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { SimulationResponse } from '../../../core/models/simulation-response.model';

@Component({
  selector: 'app-simulation-result-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './simulation-result-dialog.component.html',
  styleUrl: './simulation-result-dialog.component.css',
})
export class SimulationResultDialogComponent {
  result: SimulationResponse = inject(MAT_DIALOG_DATA);
  columns = ['position', 'bookTitle', 'authorName', 'visitorsNum'];
}
