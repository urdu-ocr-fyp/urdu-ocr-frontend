// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { UploadComponent } from './components/upload/upload.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicRouteGuard } from './guards/publicRoute.guard';
import { OcrResultComponent } from './components/ocr-result/ocr-result.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { PricingComponent } from './components/pricing/pricing.component';

const routes: Routes = [
  // Public routes – authenticated users are redirected away
  { path: '', component: LandingComponent, canActivate: [PublicRouteGuard] },
  { path: 'home', redirectTo: '', pathMatch: 'full' }, // will hit the guard above

  // Auth routes (also public, but you may also protect login/register from logged-in users)
  { path: 'login', component: LoginComponent, canActivate: [PublicRouteGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PublicRouteGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [PublicRouteGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [PublicRouteGuard] },

  // Protected routes (require authentication)
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'ocr-result', component: OcrResultComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'pricing', component: PricingComponent },

  // Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
