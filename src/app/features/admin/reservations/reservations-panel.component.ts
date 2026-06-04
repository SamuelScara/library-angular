import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservations-panel',
  standalone: true,
  imports: [NgIf, MatToolbarModule, MatTableModule, MatButtonModule, MatChipsModule],
  templateUrl: './reservations-panel.component.html',
  styleUrl: './reservations-panel.component.css',
})
export class ReservationsPanelComponent implements OnInit {
  private reservationService = inject(ReservationService);

  reservations: Reservation[] = [];
  columns = ['book', 'dateFrom', 'dateTo', 'status', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.reservationService.getAll().subscribe(r => (this.reservations = r));
  }

  setStatus(id: number, status: ReservationStatus) {
    this.reservationService.updateStatus(id, status).subscribe(() => this.load());
  }
}
