import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ApiDataService, Category } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatMenuModule, MatBadgeModule, MatIconModule, MatButtonModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  auth = inject(AuthService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  theme = inject(ThemeService);
  private apiData = inject(ApiDataService);
  router = inject(Router);

  searchQuery = '';

  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.apiData.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
    this.cart.loadCart();
    this.wishlist.loadWishlist();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  getDashboardUrl(): string {
    const role = this.auth.userRole();
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/customer/dashboard';
    }
  }

  get ordersLink(): string {
    const role = this.auth.userRole();
    switch (role) {
      case 'admin': return '/admin/orders';
      case 'vendor': return '/vendor/orders';
      default: return '/customer/orders';
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
