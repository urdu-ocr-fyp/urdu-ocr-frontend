// components/pricing/pricing.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  isLoading = false;
  errorMessage = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router
  ) {}

  subscribe(plan: 'pro' | 'enterprise'): void {
    if (!this.authService.isAuthenticated()) {
      // Save intended plan and redirect to login
      localStorage.setItem('intendedPlan', plan);
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/pricing' } });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.subscriptionService.getCheckoutUrl(plan).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Redirect to Stripe checkout
        window.location.href = res.url;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to initiate subscription. Please try again.';
        console.error(err);
      }
    });
  }

  // For Free tier: go to upload if logged in, else register
  goToFree(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/upload']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
