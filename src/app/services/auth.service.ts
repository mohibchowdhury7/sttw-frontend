import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, take, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'sttw_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  private sessionReady$ = new BehaviorSubject<boolean>(false);

  /** Emits once when the stored session has been checked (resolved or failed). */
  get whenReady(): Observable<boolean> {
    return this.sessionReady$.pipe(filter(ready => ready), take(1));
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    this.tryRestoreSession();
  }

  login(request: LoginRequest): void {
    // This is called from components, we return void and let them subscribe
  }

  loginRequest(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, request);
  }

  registerRequest(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, request);
  }

  handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.token);
    this.currentUser.set(response.user);
  }

  logout(): void {
    this.clearToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private clearToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
  }

  private tryRestoreSession(): void {
    const token = this.getToken();
    if (!token) {
      this.sessionReady$.next(true);
      return;
    }

    this.http.get<User>(`${this.apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.sessionReady$.next(true);
      },
      error: () => {
        this.clearToken();
        this.sessionReady$.next(true);
      },
    });
  }
}
