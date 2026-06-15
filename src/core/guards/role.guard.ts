import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.userRole()?.toLowerCase();

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }

    if (userRole && allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return true;
    }

    switch (userRole) {
      case 'admin':
        return router.createUrlTree(['/admin/dashboard']);
      case 'vendor':
        return router.createUrlTree(['/vendor/dashboard']);
      default:
        return router.createUrlTree(['/customer/dashboard']);
    }
  };
};
