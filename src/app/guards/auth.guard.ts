import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    // If already authenticated locally, let through immediately
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // Otherwise verify session with backend (handles Google OAuth / refresh)
    return this.authService.getProfile().pipe(
      map(res => {
        this.authService.setUserData(res.user);
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: false
        });
        return of(false);
      })
    );
  }
}