import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {}

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handle manual login
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      const { email, password } = this.loginForm.value;

      // Demo login - replace with actual authentication
      if (email === 'test@urduocr.com' && password === 'demo123') {
        console.log('Login successful:', this.loginForm.value);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }, 1500);
  }

  // Handle Google login
  onGoogleLogin(): void {
    this.isLoading = true;
    console.log('Google login initiated');

    // Simulate Google OAuth
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  // Handle GitHub login
  onGithubLogin(): void {
    this.isLoading = true;
    console.log('GitHub login initiated');

    // Simulate GitHub OAuth
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  // Navigate to register
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Forgot password
  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      console.log('Password reset requested for:', email);
      alert(`Password reset link sent to ${email}`);
    } else {
      alert('Please enter your email address first');
    }
  }

  // Mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Get form controls for easy access in template
  get f() {
    return this.loginForm.controls;
  }
}
