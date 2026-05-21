import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Author, AuthorFilters } from '../models/author.model';
import { Book, PageResponse } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = '/api/authors';

  getAll(
    filters: AuthorFilters = {},
    page = 0,
    size = 20,
    sort = 'lastName',
    direction = 'asc',
  ): Observable<PageResponse<Author>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction);
    if (filters.name?.trim()) params = params.set('name', filters.name.trim());
    if (filters.nationality?.trim()) params = params.set('nationality', filters.nationality.trim());
    return this.http.get<PageResponse<Author>>(this.baseUrl, { params });
  }

  getAllList(filters: AuthorFilters = {}): Observable<Author[]> {
    return this.getAll(filters, 0, 10000).pipe(map((r) => r.content));
  }

  getById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  getBooks(authorId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/${authorId}/books`);
  }

  create(author: Partial<Author>): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  update(id: number, author: Partial<Author>): Observable<Author> {
    return this.http.put<Author>(`${this.baseUrl}/${id}`, author);
  }

  getNationalities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/nationalities`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
