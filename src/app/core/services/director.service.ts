import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Director } from '../models/director.model';

@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  private http = inject(HttpClient);
  private baseUrl = '/api/directors';

  getAll(): Observable<Director[]> {
    return this.http.get<Director[]>(this.baseUrl);
  }

  create(director: Partial<Director>): Observable<Director> {
    return this.http.post<Director>(this.baseUrl, director);
  }

  update(directorId: number, director: Partial<Director>): Observable<Director> {
    return this.http.put<Director>(`${this.baseUrl}/${directorId}`, director);
  }

  delete(directorId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${directorId}`, { responseType: 'text' });
  }
}
