import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
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

  constructor(private http: HttpClient, private router: Router) {}

  // Register method
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
  }

  // Login method
  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, payload);
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Get profile method
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`, { headers: this.getHeaders() });
  }

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Save JWT token after login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Method to get the token in the request headers
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}