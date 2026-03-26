// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    const email = this.forgotForm.value.email;
  
    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        const token = response.resetToken;   
        
        if (token) {
          sessionStorage.setItem('resetToken', token);
          sessionStorage.setItem('resetTokenExpiry', (Date.now() + 15 * 60 * 1000).toString());
          this.router.navigate(['/reset-password']);
          this.successMessage = 'Reset token generated. Redirecting to reset page...';
          setTimeout(() => {
            this.successMessage = '';
          }, 1500);
        } else {
          this.errorMessage = 'No reset token received. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to send reset request.';
        console.error(err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}