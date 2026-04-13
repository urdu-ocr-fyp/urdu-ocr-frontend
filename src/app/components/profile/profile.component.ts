import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { FileService } from 'src/app/services/file/file.service';

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
  changePasswordForm: FormGroup;
  changePasswordLoading = false;
  changePasswordError = '';
  changePasswordSuccess = '';
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  historyData: any[] = [];
historyLoading = false;
historyError = '';
currentPage = 1;
pageSize = 10;
totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private fileService: FileService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.getHistory();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        console.log('response', response)
        this.isLoading = false;
        this.user = response.user;
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email
        });
        this.authService.setUserData(this.user)
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


  getHistory(): void {
  this.historyLoading = true;
  this.fileService.getHistory().subscribe({
    next: (response) => {
      this.historyLoading = false;

      console.log('hitory', response)
      if (response?.data && Array.isArray(response.data)) {
        this.historyData = response.data;
        this.totalItems = this.historyData.length;
        // Reset to first page on new data
        this.currentPage = 1;
      } else {
        this.historyError = 'No history data available.';
      }
    },
    error: (err) => {
      this.historyLoading = false;
      this.historyError = err.error?.message || 'Failed to load document history.';
      console.error(err);
    }
  });
}

get paginatedHistory(): any[] {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.historyData.slice(start, end);
}

changePage(page: number): void {
  if (page < 1 || page > Math.ceil(this.totalItems / this.pageSize)) return;
  this.currentPage = page;
}

get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
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

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) return;

    this.changePasswordLoading = true;
    this.changePasswordError = '';
    this.changePasswordSuccess = '';

    const { oldPassword, newPassword } = this.changePasswordForm.value;

    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: (response: any) => {
        this.changePasswordLoading = false;
        this.changePasswordSuccess = response.message || 'Password changed successfully.';
        this.changePasswordForm.reset();
        setTimeout(() => this.changePasswordSuccess = '', 3000);
      },
      error: (err: any) => {
        this.changePasswordLoading = false;
        this.changePasswordError = err?.error?.message || 'Failed to change password.';
        setTimeout(() => this.changePasswordError = '', 3000);
        console.error(err);
      }
    });
  }

  goToPricing(): void {
  // Option 1: Navigate to dedicated pricing route (if exists)
  this.router.navigate(['/pricing']);

  // Option 2: Navigate to landing page and scroll to pricing section
  // this.router.navigate(['/'], { fragment: 'pricing' });
}

viewBatchResult(batchId: string): void {
  // Navigate to OCR result page with the batch ID
  this.router.navigate(['/ocr-result', batchId]);
}
}
