import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginPayload } from 'src/app/services/auth/auth.service';
import { environment } from 'src/app/environments/environment';

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
    private fb: FormBuilder,
    private authService: AuthService   // inject the AuthService
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

    const formValue = this.loginForm.value;
    const payload: LoginPayload = {
      email: formValue.email,
      password: formValue.password
    };

    this.isLoading = true;
    this.errorMessage = '';

  this.authService.login(payload).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      console.log('response', response);

      if (response) {
        this.authService.setUserData(response?.user);
        const returnUrl = '/upload';
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    },
    error: (err: any) => {
      console.error('Login error:', err);
      this.isLoading = false;
      this.errorMessage = err?.error?.message || 'Login failed. Please try again.';
    }
  });
  }

  // Handle Google login
  onGoogleLogin(): void { 
      this.isLoading = true;
      window.location.href = `${environment.apiUrl}/auth/google`;
  }

  // Handle GitHub login
  onGithubLogin(): void {
    // this.isLoading = true;
    // console.log('GitHub login initiated');

    // setTimeout(() => {
    //   this.isLoading = false;
    //   this.authService.setLoggedIn(true);
    //   this.router.navigate(['/upload']);
    // }, 1500);
  }

  // Navigate to register
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Forgot password
  // onForgotPassword(): void {
  //   const email = this.loginForm.get('email')?.value;
  //   if (email) {
  //     console.log('Password reset requested for:', email);
  //     alert(`Mock: password reset link sent to ${email}`);
  //   } else {
  //     alert('Please enter your email address first');
  //   }
  // }

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
