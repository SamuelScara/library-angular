import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import {
  AppUser,
  AuthResponse,
  LoginRequest,
  ProfileUpdateRequest,
  RegisterRequest,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = '/api/auth';

  private readonly TOKEN_KEY = 'jwt_token';

  // Current user status, null = not authenticated
  currentUser$ = new BehaviorSubject<AppUser | null>(null);

  // Called at the starting of the app (APP_INITIALIZER) for restoring the session, if the JSESSIONID cookie is valid the server returns the user's data
  init(): Observable<AppUser | null> {
    const token = this.getToken();

    if (!token) return of(null);

    return this.http.get<AppUser>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.currentUser$.next(user)),
      catchError(() => {
        // expired token or not valid: clean state
        this.clearToken();
        return of(null);
      }),
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.currentUser$.next({
          id: response.id,
          username: response.username,
          role: response.role,
        });
      }),
    );
  }

  register(request: RegisterRequest): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    // deletes only the local token
    this.clearToken();
    this.currentUser$.next(null);
    this.router.navigate(['/catalog']);
  }

  updateProfile(request: ProfileUpdateRequest): Observable<AppUser> {
    return this.http
      .put<AppUser>(`${this.baseUrl}/profile`, request)
      .pipe(tap((user) => this.currentUser$.next(user)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAdmin(): boolean {
    return this.currentUser$.value?.role === 'ROLE_ADMIN';
  }

  isAuthor(): boolean {
    return this.currentUser$.value?.role === 'ROLE_AUTHOR';
  }

  isDirector(): boolean {
    return this.currentUser$.value?.role == 'ROLE_DIRECTOR';
  }

  isLoggedIn(): boolean {
    return this.currentUser$.value !== null;
  }
}
