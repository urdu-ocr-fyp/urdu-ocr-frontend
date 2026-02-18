import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
      ]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {}

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handle registration
  onRegister(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Registration successful:', this.registerForm.value);

      // Show success message
      this.successMessage = 'Account created successfully! Redirecting to login...';

      // Redirect to login after delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 2000);
  }

  // Handle Google registration
  onGoogleRegister(): void {
    this.isLoading = true;
    console.log('Google registration initiated');

    // Simulate Google OAuth
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  // Handle Discord registration
  onDiscordRegister(): void {
    this.isLoading = true;
    console.log('Discord registration initiated');

    // Simulate Discord OAuth
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  // Navigate to login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Get password strength
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

  // Mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Get form controls for easy access
  get f() {
    return this.registerForm.controls;
  }
}
