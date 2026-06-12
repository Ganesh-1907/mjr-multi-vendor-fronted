import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';

export const VENDOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['vendor'] as UserRole[])],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.VendorDashboardComponent) },
      { path: 'store', loadComponent: () => import('./store/store.component').then(m => m.StoreComponent) },
      { path: 'products', loadComponent: () => import('./products/products.component').then(m => m.VendorProductsComponent) },
      { path: 'orders', loadComponent: () => import('./orders/orders.component').then(m => m.VendorOrdersComponent) },
      { path: 'analytics', loadComponent: () => import('./analytics/analytics.component').then(m => m.VendorAnalyticsComponent) },
      { path: 'reviews', loadComponent: () => import('./reviews/reviews.component').then(m => m.VendorReviewsComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.VendorSettingsComponent) }
    ]
  }
];
