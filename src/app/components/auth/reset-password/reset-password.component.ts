// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('resetToken');
    const expiry = sessionStorage.getItem('resetTokenExpiry');
    
    if (!this.token) {
      this.errorMessage = 'No reset token found. Please request a new password reset.';
      setTimeout(() => {
        this.router.navigate(['/forgot-password']);
      }, 2000);
      return;
    }
    
    if (expiry && Date.now() > parseInt(expiry)) {
      this.errorMessage = 'Reset link has expired. Please request a new one.';
      sessionStorage.removeItem('resetToken');
      sessionStorage.removeItem('resetTokenExpiry');
      setTimeout(() => {
        this.router.navigate(['/forgot-password']);
      }, 2000);
      return;
    }
  }

  get f() { return this.resetForm.controls; }

  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { matching: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully! You are now logged in.';
        
        sessionStorage.removeItem('resetToken');
        sessionStorage.removeItem('resetTokenExpiry');
        
        if (response.user) {
          this.authService.setUserData(response.user);
        }
        
        setTimeout(() => {
          this.router.navigate(['/upload']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to reset password. Please try again.';
        
        if (err?.error?.message?.includes('expired') || err?.error?.message?.includes('invalid')) {
          sessionStorage.removeItem('resetToken');
          sessionStorage.removeItem('resetTokenExpiry');
        }
        
        console.error(err);
      }
    });
  }

  goToLogin(): void {
    sessionStorage.removeItem('resetToken');
    sessionStorage.removeItem('resetTokenExpiry');
    this.router.navigate(['/login']);
  }
}