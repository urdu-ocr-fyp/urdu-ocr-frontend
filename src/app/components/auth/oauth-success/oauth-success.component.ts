import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-oauth-success',
  templateUrl: './oauth-success.component.html',
  styleUrls: ['./oauth-success.component.css']
})
export class OauthSuccessComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // After OAuth, the cookie is set; fetch user profile to confirm and store user data.
    this.authService.getProfile().subscribe({
      next: (user: any) => {
        this.authService.setUserData(user); // Store user in localStorage (if you use it)
        this.router.navigate(['/upload']);
      },
      error: () => {
        // If profile fetch fails, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}
