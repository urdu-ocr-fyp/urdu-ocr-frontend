import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isLoggedIn';

  constructor(private router: Router) {}

  // Mock login – accepts any email/password (except empty)
  login(email: string, password: string): Observable<boolean> {
    // Simulate an API call
    return of(email.trim() !== '' && password.trim() !== '').pipe(
      delay(800) // simulate network delay
    );
  }

  // Store the authenticated state
  setLoggedIn(value: boolean): void {
    localStorage.setItem(this.AUTH_KEY, String(value));
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  // Logout – clear the flag and navigate to login
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }
}