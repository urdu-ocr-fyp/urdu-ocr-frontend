import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // CanActivate is used to guard routes
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      // If the user is authenticated, allow access
      return true;
    }

    // Not authenticated, attempt to refresh token or redirect to login
    return this.checkLoginStatus();
  }

  // Check if the user is authenticated or needs to be redirected to the login page
  private checkLoginStatus(): boolean {
    // Optionally check token validity, here you can add a refresh token logic if necessary
    const token = this.authService.getToken();

    // If token exists but is invalid, you can attempt a refresh or direct them to login
    if (token && this.isTokenExpired(token)) {
      // Optionally, call a method to refresh the token or logout
      this.authService.logout(); // Clear expired token
      this.router.navigate(['/login']);
      return false;
    }

    // If no token or expired, redirect to login page
    this.router.navigate(['/login']);
    return false;
  }

  // Helper function to check if the JWT token is expired
  private isTokenExpired(token: string): boolean {
    const decoded: any = this.decodeToken(token);
    if (!decoded) return true;

    const expiry = decoded.exp * 1000; // JWT expiry time is in seconds
    return Date.now() > expiry;
  }

  // Decode JWT token (simplified for demo purposes)
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)); // Decode base64-encoded token payload
    } catch (error) {
      return null;
    }
  }
}