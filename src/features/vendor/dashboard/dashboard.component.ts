import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatProgressBarModule, MatDividerModule],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1>Welcome, {{auth.currentUser()?.firstName}}!</h1>
        <p>Here's your store performance overview.</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>inventory_2</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{products().length}}</span>
              <span class="stat-label">Total Products</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>orders</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{orders().length}}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card revenue">
          <mat-card-content>
            <mat-icon>payments</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{totalRevenue() | currency:'INR'}}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>star</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{vendorRating() | number:'1.1-1'}}</span>
              <span class="stat-label">Store Rating</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="recent-orders-card">
        <mat-card-header>
          <mat-card-title>Recent Orders</mat-card-title>
          <a mat-button routerLink="/vendor/orders">View All</a>
        </mat-card-header>
        <mat-card-content>
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              @for (order of orders().slice(0, 5); track order.id) {
                <tr>
                  <td>{{order.orderNumber}}</td>
                  <td>{{order.customerName || order.customer?.firstName}}</td>
                  <td>{{order.total || order.totalAmount | currency:'INR'}}</td>
                  <td><span class="status-badge {{order.status}}">{{order.status}}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a mat-raised-button color="primary" routerLink="/vendor/products"><mat-icon>add</mat-icon> Add Product</a>
          <a mat-stroked-button routerLink="/vendor/orders"><mat-icon>orders</mat-icon> View Orders</a>
          <a mat-stroked-button routerLink="/vendor/analytics"><mat-icon>analytics</mat-icon> View Analytics</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home { max-width: 1200px; margin: 0 auto; }
    .welcome-section { margin-bottom: 32px; }
    .welcome-section h1 { font-size: 28px; margin-bottom: 8px; color: var(--text-primary); }
    .welcome-section p { color: var(--text-secondary); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 24px !important; }
    .stat-card mat-icon { font-size: 48px; color: var(--primary); }
    .stat-card.revenue mat-icon { color: #10b981; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .recent-orders-card { margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
    th { font-weight: 600; color: var(--text-secondary); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.pending, .status-badge.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.shipped { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .status-badge.delivered { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .quick-actions h2 { font-size: 20px; margin-bottom: 16px; color: var(--text-primary); }
    .actions-grid { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class VendorDashboardComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);

  products = signal<any[]>([]);
  orders = signal<any[]>([]);
  vendorRating = signal(0);
  totalRevenue = computed(() => this.orders().reduce((sum: number, o: any) => sum + (o.total || o.totalAmount || 0), 0));

  ngOnInit(): void {
    this.apiData.getVendorProducts().subscribe(data => this.products.set(data));
    this.apiData.getVendorOrders(0).subscribe(data => this.orders.set(data));
    this.apiData.getVendorAnalytics().subscribe((data: any) => {
      if (data?.vendor?.rating) {
        this.vendorRating.set(data.vendor.rating);
      } else if (data?.rating) {
        this.vendorRating.set(data.rating);
      }
    });
  }
}
