// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Store the attempted URL for redirecting after login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url },
      replaceUrl: false
    });
    
    return false;
  }
}