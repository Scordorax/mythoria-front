import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // 🔹 Ne pas ajouter le token sur login / register
  if (
    req.url.includes('/login') ||
    req.url.includes('/register')
  ) {
    return next(req);
  }

  // 🔹 Si token présent → on clone la requête
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 🔹 Gestion des erreurs
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Si token expiré ou invalide
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};