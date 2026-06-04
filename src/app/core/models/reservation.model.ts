export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface Reservation {
  id: number;
  bookId: number;
  bookTitle: string;
  dateFrom: string;
  dateTo: string;
  status: ReservationStatus;
}

export interface ReservationRequest {
  bookId: number;
  dateFrom: string;
  dateTo: string;
}


