import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = '/api/books';

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  create(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book);
  }

  update(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  assignAuthor(bookId: number, authorId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${bookId}/authors/${authorId}`, null, {
      responseType: 'text',
    });
  }

  unassignAuthor(bookId: number, authorId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${bookId}/authors/${authorId}`, {
      responseType: 'text',
    });
  }
}
