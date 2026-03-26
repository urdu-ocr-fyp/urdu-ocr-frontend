// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly USER_KEY = 'userData';

  constructor(private http: HttpClient, private router: Router) {}

  // Register method - cookie automatically set by browser
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
  }

  // Login method - cookie automatically set by browser
  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, payload);
  }

  // Get user profile (cookie automatically sent by browser)
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  // Profile with userId (cookie automatically sent)
  profile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`, {
      params: { userId }
    });
  }

  // Store ONLY user data (no token)
  setUserData(userData: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Get stored user data
  getUserData(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Clear user data
  clearUserData(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Logout - clear user data, cookie will expire or be cleared by backend
  logout(): void {
    // Optional: Call logout endpoint to clear cookie on server
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearUserData();
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: () => {
        // Even if logout fails, clear local data
        this.clearUserData();
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  // Check if user is authenticated by checking user data
  isAuthenticated(): boolean {
    return !!this.getUserData();
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  // Reset password using token and new password
  resetPassword(resetToken: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { resetToken, newPassword });
  }

  // profile.service.ts
changePassword(oldPassword: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/change-password`, { oldPassword, newPassword });
}
}