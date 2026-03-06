import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { ProfileComponent } from './profile.component';


export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];