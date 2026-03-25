import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../../services/auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService // Inject AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        // Validators.required,
        // Validators.minLength(8),
        // Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
      ]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {}

  // Handle registration
  onRegister(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const payload: RegisterPayload = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    };


    // Call AuthService to register the user with real-time API
    // signup.component.ts
this.authService.register(payload).subscribe({
  next: (response: any) => {
    this.isLoading = false;
    console.log('Signup response:', response);

    // Store the session cookie and user data from the nested structure
    if (response?.sessionCookie && response?.user) {
      // Extract user data from response (excluding sessionCookie)
      // const { sessionCookie, ...userData } = response.user;

      // Store in localStorage
      this.authService.setSession(response?.sessionCookie, response?.user);
      console.log('✅ Session stored successfully');
      console.log('User data stored:', response?.user);
    } else {
      console.log('Response structure:', response);
    }

    this.successMessage = 'Account created successfully! Redirecting to upload page...';

    // Navigate directly to upload page
    setTimeout(() => {
      this.router.navigate(['/upload'], { replaceUrl: true });
    }, 1500);
  },
  error: (err: any) => {
    console.error('Signup error:', err);
    this.isLoading = false;
    this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
  }
});
  }

  // Navigate to login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onGoogleRegister(): void {
    this.isLoading = true;
    console.log('Google registration initiated');

    // Simulate Google OAuth
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const length = password.length;

    if (length >= 12 && hasLetters && hasNumbers) return 'Strong';
    if (length >= 8 && hasLetters && hasNumbers) return 'Medium';
    return 'Weak';
  }

  // Get password strength color
  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'Strong': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Weak': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  // Get form controls for easy access
  get f() {
    return this.registerForm.controls;
  }
}
