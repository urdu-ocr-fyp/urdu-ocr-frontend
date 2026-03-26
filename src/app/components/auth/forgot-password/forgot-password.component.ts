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
        console.log('resp', response)
        this.successMessage = response.message || 'Password reset email sent. Check your inbox.';
        // Optional: clear form
        this.forgotForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.log('error', err)
        this.errorMessage = err?.error?.message || 'Failed to send reset email. Please try again.';
        console.error(err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}