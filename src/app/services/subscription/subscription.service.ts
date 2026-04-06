// services/subscription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Get Stripe checkout URL for a plan */
  getCheckoutUrl(plan: 'pro' | 'enterprise'): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/auth/check-subscription`, { plan });
  }

  /** Cancel current subscription */
  cancelSubscription(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/auth/cancel-subscription`);
  }
}
