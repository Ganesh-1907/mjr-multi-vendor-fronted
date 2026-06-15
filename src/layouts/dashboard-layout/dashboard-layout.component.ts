import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatDividerModule, MatBadgeModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  cart = inject(CartService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  isSidenavOpen = true;

  userInitials = computed(() => {
    const user = this.auth.currentUser();
    if (user) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    return 'U';
  });

  userName = computed(() => {
    const user = this.auth.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  });

  menuItems = computed(() => {
    const role = this.auth.userRole();
    switch (role) {
      case 'vendor':
        return [
          { icon: 'dashboard', label: 'Dashboard', path: '/vendor/dashboard' },
          { icon: 'store', label: 'Store Profile', path: '/vendor/store' },
          { icon: 'inventory_2', label: 'Products', path: '/vendor/products' },
          { icon: 'receipt_long', label: 'Orders', path: '/vendor/orders' },
          { icon: 'analytics', label: 'Analytics', path: '/vendor/analytics' },
          { icon: 'settings', label: 'Settings', path: '/vendor/settings' }
        ];
      case 'admin':
        return [
          { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
          { icon: 'people', label: 'Customer Management', path: '/admin/users' },
          { icon: 'storefront', label: 'Vendors', path: '/admin/vendors' },
          { icon: 'inventory', label: 'Products', path: '/admin/products' },
          { icon: 'receipt_long', label: 'Orders', path: '/admin/orders' },
          { icon: 'category', label: 'Categories', path: '/admin/categories' },
          { icon: 'confirmation_number', label: 'Coupons', path: '/admin/coupons' },
          { icon: 'image', label: 'Banners', path: '/admin/banners' },
          { icon: 'bar_chart', label: 'Reports', path: '/admin/reports' },
          { icon: 'contact_support', label: 'Contact Messages', path: '/admin/contacts' }
        ];
      default:
        return [
          { icon: 'dashboard', label: 'Dashboard', path: '/customer/dashboard' },
          { icon: 'shopping_bag', label: 'Orders', path: '/customer/orders' },
          { icon: 'favorite', label: 'Wishlist', path: '/customer/wishlist' },
          { icon: 'shopping_cart', label: 'Cart', path: '/customer/cart' },
          { icon: 'location_on', label: 'Addresses', path: '/customer/addresses' },
          { icon: 'support_agent', label: 'Support', path: '/customer/support' },
          { icon: 'settings', label: 'Settings', path: '/customer/settings' }
        ];
    }
  });

  get homeLink(): string {
    return '/';
  }

  profileLink = computed(() => {
    const role = this.auth.userRole();
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'vendor': return '/vendor/settings';
      default: return '/customer/settings';
    }
  });

  getDashboardUrl(): string {
    const role = this.auth.userRole();
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/customer/dashboard';
    }
  }

  logout(): void {
    this.auth.logout();
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
