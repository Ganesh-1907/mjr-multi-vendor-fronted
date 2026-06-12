import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['customer'] as UserRole[])],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.CustomerDashboardComponent) },
      { path: 'orders', loadComponent: () => import('./orders/orders.component').then(m => m.CustomerOrdersComponent) },
      { path: 'wishlist', loadComponent: () => import('../public/wishlist/wishlist.component').then(m => m.WishlistComponent) },
      { path: 'cart', loadComponent: () => import('../public/cart/cart.component').then(m => m.CartComponent) },
      { path: 'addresses', loadComponent: () => import('./addresses/addresses.component').then(m => m.AddressesComponent) },
      { path: 'support', loadComponent: () => import('./support/support.component').then(m => m.SupportComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];
