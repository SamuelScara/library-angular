import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookFilters, BookStats } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = '/api/books';

  getAll(filters: BookFilters = {}): Observable<Book[]> {
    let params = new HttpParams();
    if (filters.yearFrom != null) params = params.set('yearFrom', filters.yearFrom);
    if (filters.yearTo != null) params = params.set('yearTo', filters.yearTo);
    if (filters.availability != null) params = params.set('availability', filters.availability);
    if (filters.authorName?.trim()) params = params.set('authorName', filters.authorName.trim());
    return this.http.get<Book[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  getBookStats(id: number): Observable<BookStats> {
    return this.http.get<BookStats>(`${this.baseUrl}/${id}/stats`);
  }

  getAllBooksStats(): Observable<BookStats[]> {
    return this.http.get<BookStats[]>(`${this.baseUrl}/stats`);
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
