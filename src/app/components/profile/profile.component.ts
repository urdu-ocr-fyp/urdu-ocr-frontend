import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  user: any = null;
  subscription: any = null; // we might get subscription status from a dedicated endpoint
  showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.user = response.user;
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email
        });
        // Optionally load subscription status here
        // this.loadSubscription();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to load profile.';
        console.error(err);
      }
    });
  }

  onUpdate(): void {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    const { name, email } = this.profileForm.value;
    this.profileService.updateProfile(name, email).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Profile updated successfully.';
        // Update stored user data in AuthService
        if (response.user) {
          this.authService.setUserData(response.user);
          this.user = response.user;
        }
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile.';
        setTimeout(() => this.errorMessage = '', 3000);
        console.error(err);
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    this.isLoading = true;
    this.profileService.deleteAccount().subscribe({
      next: () => {
        this.isLoading = false;
        this.authService.logout(); // clears local data and redirects to login
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to delete account.';
        setTimeout(() => this.errorMessage = '', 3000);
        console.error(err);
      }
    });
  }

  subscribe(plan: string): void {
    this.isLoading = true;
    this.profileService.checkSubscription(plan).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.url) {
          // Redirect to Stripe checkout
          window.location.href = response.url;
        } else {
          this.errorMessage = 'No checkout URL returned.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to initiate subscription.';
        console.error(err);
      }
    });
  }

  cancelSubscription(): void {
    this.isLoading = true;
    this.profileService.cancelSubscription().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Subscription cancelled.';
        // Optionally refresh subscription status
        // this.loadSubscription();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to cancel subscription.';
        console.error(err);
      }
    });
  }
}