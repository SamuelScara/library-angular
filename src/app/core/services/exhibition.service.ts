import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exhibition } from '../models/exhibition.model';
import { SimulationResponse } from '../models/simulation-response.model';

@Injectable({
  providedIn: 'root',
})
export class ExhibitionService {
  private http = inject(HttpClient);
  private baseUrl = '/api/exhibitions';

  getAll(): Observable<Exhibition[]> {
    return this.http.get<Exhibition[]>(this.baseUrl);
  }

  create(exhibition: Partial<Exhibition>): Observable<Exhibition> {
    return this.http.post<Exhibition>(this.baseUrl, exhibition);
  }

  update(id: number, dto: Partial<Exhibition>): Observable<Exhibition> {
    return this.http.put<Exhibition>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  simulate(id: number): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(`${this.baseUrl}/${id}/simulate`, null);
  }
}
