import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifie connexion
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Vérifie rôle admin
  const isAdmin = authService.hasRole('ROLE_ADMIN');

  if (isAdmin) {
    return true;
  }

  // Redirection si pas admin
  router.navigate(['/dashboard']);
  return false;
};