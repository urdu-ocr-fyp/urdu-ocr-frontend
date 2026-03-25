import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get current user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  // Update user name/email
  updateProfile(name: string, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/me`, { name, email });
  }

  // Delete user account
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/me`);
  }

  // Get Stripe checkout URL for a plan
  checkSubscription(plan: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscription/checkout`, { plan });
  }

  // Cancel current subscription
  cancelSubscription(): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscription/cancel`, {});
  }
}
