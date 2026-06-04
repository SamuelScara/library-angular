import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppUser, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = '/api/auth';

  // Current user status, null = not authenticated
  currentUser$ = new BehaviorSubject<AppUser | null>(null);

  // Called at the starting of the app (APP_INITIALIZER) for restoring the session, if the JSESSIONID cookie is valid the server returns the user's data
  init(): Observable<AppUser> {
    return this.http
      .get<AppUser>(`${this.baseUrl}/me`)
      .pipe(tap((user) => this.currentUser$.next(user)));
  }

  login(request: LoginRequest): Observable<AppUser> {
    return this.http
      .post<AppUser>(`${this.baseUrl}/login`, request)
      .pipe(tap((user) => this.currentUser$.next(user)));
  }

  register(request: RegisterRequest): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe(() => {
      this.currentUser$.next(null);
      this.router.navigate(['/login']);
    });
  }

  isAdmin(): boolean {
    return this.currentUser$.value?.role === 'ROLE_ADMIN';
  }

  isLoggedIn(): boolean {
    return this.currentUser$.value !== null;
  }
}
