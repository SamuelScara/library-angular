import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Director } from '../models/director.model';
import { Lib } from '../models/lib.model';

@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  private http = inject(HttpClient);
  private baseUrl = '/api/directors';

  getAll(): Observable<Director[]> {
    return this.http.get<Director[]>(this.baseUrl);
  }

  getById(id: number): Observable<Director> {
    return this.http.get<Director>(`${this.baseUrl}/${id}`);
  }

  getLib(directorId: number): Observable<Lib> {
    return this.http.get<Lib>(`${this.baseUrl}/${directorId}/lib`);
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
