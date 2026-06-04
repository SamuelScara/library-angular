import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [NgIf, MatToolbarModule, MatTableModule, MatButtonModule, MatChipsModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
})
export class MyReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);

  reservations: Reservation[] = [];
  columns = ['book', 'dateFrom', 'dateTo', 'status', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.reservationService.getMine().subscribe(r => (this.reservations = r));
  }

  cancel(id: number) {
    this.reservationService.cancel(id).subscribe(() => this.load());
  }

  statusColor(status: string): 'primary' | 'accent' | 'warn' | '' {
    const map: Record<string, 'primary' | 'accent' | 'warn' | ''> = {
      PENDING: 'accent',
      APPROVED: 'primary',
      REJECTED: 'warn',
      RETURNED: '',
    };
    return map[status] ?? '';
  }
}
