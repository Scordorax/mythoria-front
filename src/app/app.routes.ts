import { Routes } from '@angular/router';
import { LoginComponent } from '../core/features/auth/login.component';
import { RegisterComponent } from '../core/features/auth/register.component';
import { DashboardComponent } from '../core/features/dashboard/dashboard.component';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },

];
