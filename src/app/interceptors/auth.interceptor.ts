// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Clone the request and add withCredentials: true
    // This tells the browser to send cookies with this request
    const authReq = req.clone({
      withCredentials: true
    });
    
    // Pass the modified request to the next handler
    return next.handle(authReq).pipe(
      tap({
        next: (event) => {
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Request failed:', req.url, error);
        }
      })
    );
  }
}