import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = '/api/authors';

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl);
  }

  create(author: Partial<Author>): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
