import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const role = authService.currentUser()?.rol;
  
  console.log('[AuthGuard] Path intentado:', state.url);
  console.log('[AuthGuard] ¿Autenticado?', isAuthenticated);
  console.log('[AuthGuard] Rol detectado:', role);

  if (isAuthenticated) {
    return true;
  }

  console.log('[AuthGuard] Redirigiendo a /login...');
  return router.parseUrl('/login');
};
