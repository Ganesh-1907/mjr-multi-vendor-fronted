import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin'] as UserRole[])],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./users/users.component').then(m => m.AdminUsersComponent) },
      { path: 'vendors', loadComponent: () => import('./vendors/vendors.component').then(m => m.AdminVendorsComponent) },
      { path: 'products', loadComponent: () => import('./products/products.component').then(m => m.AdminProductsComponent) },
      { path: 'categories', loadComponent: () => import('./categories/categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'coupons', loadComponent: () => import('./coupons/coupons.component').then(m => m.AdminCouponsComponent) },
      { path: 'banners', loadComponent: () => import('./banners/banners.component').then(m => m.AdminBannersComponent) },
      { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.AdminReportsComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.AdminSettingsComponent) }
    ]
  }
];
