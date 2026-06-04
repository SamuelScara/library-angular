import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = '/api/reviews';

  getByBook(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/book/${bookId}`);
  }

  create(request: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, request);
  }

  update(id: number, request: ReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
