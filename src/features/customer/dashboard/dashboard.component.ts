import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatProgressBarModule],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome back, {{auth.currentUser()?.firstName}}!</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div class="quick-actions">
          <a mat-raised-button color="primary" routerLink="/products"><mat-icon>search</mat-icon> Browse Products</a>
          <button mat-stroked-button color="primary"><mat-icon>history</mat-icon> Reorder</button>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>shopping_bag</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{orders().length}}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>pending_actions</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{pendingOrders()}}</span>
              <span class="stat-label">Pending Orders</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>favorite</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{wishlist.itemCount()}}</span>
              <span class="stat-label">Wishlist Items</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>shopping_cart</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{cart.itemCount()}}</span>
              <span class="stat-label">Cart Items</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-grid">
        <mat-card class="recent-orders">
          <mat-card-header>
            <mat-card-title>Recent Orders</mat-card-title>
            <a mat-button routerLink="/customer/orders">View All</a>
          </mat-card-header>
          <mat-card-content>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                @for (order of orders().slice(0, 5); track order.id) {
                  <tr>
                    <td><a [routerLink]="['/customer/orders', order.id]">{{order.orderNumber}}</a></td>
                    <td>{{order.createdAt | date:'shortDate'}}</td>
                    <td><span class="status-badge {{order.status}}">{{order.status}}</span></td>
                    <td>{{order.total || order.totalAmount | currency:'INR'}}</td>
                  </tr>
                }
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

        <mat-card class="quick-links">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <a mat-stroked-button routerLink="/customer/orders"><mat-icon>receipt_long</mat-icon> Track Orders</a>
            <a mat-stroked-button routerLink="/customer/addresses"><mat-icon>location_on</mat-icon> Manage Addresses</a>
            <a mat-stroked-button routerLink="/customer/support"><mat-icon>support_agent</mat-icon> Get Support</a>
            <a mat-stroked-button routerLink="/customer/wishlist"><mat-icon>favorite</mat-icon> View Wishlist</a>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home { max-width: 1200px; margin: 0 auto; }
    .welcome-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .welcome-text h1 { font-size: 28px; margin-bottom: 8px; color: var(--text-primary); }
    .welcome-text p { color: var(--text-secondary); }
    .quick-actions { display: flex; gap: 12px; }
    .quick-actions .mat-icon { margin-right: 8px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 24px !important; }
    .stat-card mat-icon { font-size: 48px; color: var(--primary); }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 32px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .recent-orders table { width: 100%; border-collapse: collapse; }
    .recent-orders th, .recent-orders td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
    .recent-orders th { font-weight: 600; color: var(--text-secondary); }
    .recent-orders a { color: var(--primary); text-decoration: none; }
    .recent-orders a:hover { text-decoration: underline; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.pending, .status-badge.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.shipped { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .status-badge.delivered { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-badge.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .quick-links mat-card-content { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px !important; }
    .quick-links a { display: inline-flex; align-items: center; justify-content: flex-start; color: var(--text-primary); }
    .quick-links mat-icon { margin-right: 8px; }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } .quick-links mat-card-content { grid-template-columns: 1fr; } }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);

  orders = signal<any[]>([]);
  pendingOrders = computed(() => this.orders().filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length);

  ngOnInit(): void {
    this.apiData.getOrders().subscribe(data => this.orders.set(data));
    this.cart.loadCart();
    this.wishlist.loadWishlist();
  }
}
