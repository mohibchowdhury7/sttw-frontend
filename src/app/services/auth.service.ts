import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'sttw_auth_token';
const USER_KEY = 'sttw_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    this.restoreSession();
  }

  loginRequest(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, request);
  }

  registerRequest(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, request);
  }

  handleAuthSuccess(response: AuthResponse): void {
    this.saveSession(response.token, response.user);
    this.currentUser.set(response.user);
  }

  logout(): void {
    this.clearSession();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /** Called by the interceptor when a 401 response is received. */
  handleUnauthorized(): void {
    this.clearSession();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private saveSession(token: string, user: User): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /** Restore user from localStorage synchronously. No HTTP calls. */
  private restoreSession(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (!token || !userJson) {
      this.clearSession();
      return;
    }

    try {
      const user: User = JSON.parse(userJson);
      this.currentUser.set(user);
    } catch {
      this.clearSession();
    }
  }
}
