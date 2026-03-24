// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'sessionCookie';
  private readonly USER_KEY = 'userData';

  constructor(private http: HttpClient, private router: Router) {}

  // Register method
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
  }

  // Login method
  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, payload);
  }

  // Store session data after successful auth
  setSession(sessionCookie: string, userData: any): void {
    localStorage.setItem(this.TOKEN_KEY, sessionCookie);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Get stored session cookie (JWT)
  getSessionCookie(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored user data
  getUserData(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated (has a token)
  isAuthenticated(): boolean {
    return !!this.getSessionCookie();
  }

  // Get headers with Authorization Bearer token
  private getHeaders(): HttpHeaders {
    const token = this.getSessionCookie();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // Get profile (protected endpoint)
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`, { headers: this.getHeaders() });
  }
}