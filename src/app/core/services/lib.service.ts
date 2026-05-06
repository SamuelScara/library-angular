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
}
