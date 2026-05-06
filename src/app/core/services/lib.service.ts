import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lib } from '../models/lib.model';

@Injectable({
  providedIn: 'root',
})
export class LibService {
  private http = inject(HttpClient);
  private baseUrl = '/api/libs';

  getAll(): Observable<Lib[]> {
    return this.http.get<Lib[]>(this.baseUrl);
  }

  create(lib: Partial<Lib>): Observable<Lib> {
    return this.http.post<Lib>(this.baseUrl, lib);
  }

  update(id: number, lib: Partial<Lib>): Observable<Lib> {
    return this.http.put<Lib>(`${this.baseUrl}/${id}`, lib);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  assignBook(libId: number, bookId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${libId}/books/${bookId}`, null, {
      responseType: 'text',
    });
  }

  unassignBook(libId: number, bookId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${libId}/books/${bookId}`, {
      responseType: 'text',
    });
  }
}
