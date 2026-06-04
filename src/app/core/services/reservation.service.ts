import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest, ReservationStatus } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = '/api/reservations';

  getMine(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/my`);
  }

  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, request);
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  updateStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/status`, null, {
      params: { status },
    });
  }
}
