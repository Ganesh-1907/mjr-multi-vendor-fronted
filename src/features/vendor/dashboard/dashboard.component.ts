import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Order } from '../../../core/models';

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
              <span class="stat-value">{{products.length}}</span>
              <span class="stat-label">Total Products</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>orders</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{orders.length}}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card revenue">
          <mat-card-content>
            <mat-icon>payments</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{totalRevenue | currency:'INR'}}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon>star</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{vendor?.rating | number:'1.1-1'}}</span>
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
              @for (order of orders.slice(0, 5); track order.id) {
                <tr>
                  <td>{{order.orderNumber}}</td>
                  <td>{{order.customerName}}</td>
                  <td>{{order.total | currency:'INR'}}</td>
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
    .welcome-section h1 { font-size: 28px; margin-bottom: 8px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 24px !important; }
    .stat-card mat-icon { font-size: 48px; color: #1a237e; }
    .stat-card.revenue mat-icon { color: #388e3c; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; }
    .stat-label { font-size: 14px; color: #757575; }
    .recent-orders-card { margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { font-weight: 600; color: #666; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.pending, .status-badge.processing { background: #fff3e0; color: #e65100; }
    .status-badge.shipped { background: #e3f2fd; color: #1565c0; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .quick-actions h2 { font-size: 20px; margin-bottom: 16px; }
    .actions-grid { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class VendorDashboardComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);

  vendor = this.dataService.getVendorById(this.auth.currentUser()?.id || '');
  products = this.vendor ? this.dataService.getProductsByVendor(this.vendor.id) : [];
  orders: Order[] = this.vendor ? this.dataService.getOrdersByVendor(this.vendor.id) : [];

  totalRevenue = this.orders.reduce((sum, o) => sum + o.total, 0);
}
