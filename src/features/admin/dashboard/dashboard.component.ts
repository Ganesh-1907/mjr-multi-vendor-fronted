import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of your marketplace.</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card"><mat-card-content>
          <mat-icon>people</mat-icon>
          <div class="stat-info"><span class="stat-value">{{customers()}}</span><span class="stat-label">Total Customers</span></div>
        </mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-content>
          <mat-icon>storefront</mat-icon>
          <div class="stat-info"><span class="stat-value">{{vendors()}}</span><span class="stat-label">Total Vendors</span></div>
        </mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-content>
          <mat-icon>inventory_2</mat-icon>
          <div class="stat-info"><span class="stat-value">{{products()}}</span><span class="stat-label">Total Products</span></div>
        </mat-card-content></mat-card>
        <mat-card class="stat-card revenue"><mat-card-content>
          <mat-icon>payments</mat-icon>
          <div class="stat-info"><span class="stat-value">INR {{totalRevenue() | number:'1.0-0'}}</span><span class="stat-label">Total Revenue</span></div>
        </mat-card-content></mat-card>
        <mat-card class="stat-card"><mat-card-content>
          <mat-icon>receipt_long</mat-icon>
          <div class="stat-info"><span class="stat-value">{{totalOrders()}}</span><span class="stat-label">Total Orders</span></div>
        </mat-card-content></mat-card>
      </div>

      <div class="dashboard-grid">
        <mat-card class="recent-orders">
          <mat-card-header><mat-card-title>Recent Orders</mat-card-title></mat-card-header>
          <mat-card-content>
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                @for (order of orders().slice(0, 5); track order.id) {
                  <tr>
                    <td>{{order.orderNumber}}</td>
                    <td>{{order.customerName || order.customer?.firstName || 'N/A'}}</td>
                    <td>{{order.total || order.totalAmount | currency:'INR'}}</td>
                    <td><span class="status-badge {{order.status}}">{{order.status}}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

        <mat-card class="pending-approvals">
          <mat-card-header><mat-card-title>Pending Approvals</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="approval-item">
              <span>Products Pending Approval</span>
              <span class="badge">{{pendingProducts()}}</span>
            </div>
            <button mat-raised-button color="primary" routerLink="/admin/products">Review Products</button>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a mat-raised-button routerLink="/admin/users"><mat-icon>people</mat-icon> Manage Users</a>
          <a mat-raised-button routerLink="/admin/orders"><mat-icon>receipt_long</mat-icon> Manage Orders</a>
          <a mat-raised-button routerLink="/admin/vendors"><mat-icon>storefront</mat-icon> Manage Vendors</a>
          <a mat-raised-button routerLink="/admin/categories"><mat-icon>category</mat-icon> Categories</a>
          <a mat-raised-button routerLink="/admin/reports"><mat-icon>analytics</mat-icon> View Reports</a>
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
    .stat-card mat-icon { font-size: 48px; color: var(--primary); }
    .stat-card.revenue mat-icon { color: #10b981; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
    th { font-weight: 600; color: var(--text-secondary); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.delivered { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .approval-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: var(--text-primary); }
    .badge { background: #d32f2f; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 600; }
    .quick-actions h2 { font-size: 20px; margin-bottom: 16px; color: var(--text-primary); }
    .actions-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .actions-grid a { display: flex; align-items: center; gap: 8px; color: var(--text-primary); }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  apiData = inject(ApiDataService);

  customers = signal(0);
  vendors = signal(0);
  products = signal(0);
  orders = signal<any[]>([]);
  totalRevenue = signal(0);
  totalOrders = signal(0);
  pendingProducts = signal(0);

  ngOnInit(): void {
    this.apiData.getAdminDashboard().subscribe({
      next: (data: any) => {
        this.customers.set(data.totalCustomers || 0);
        this.vendors.set(data.totalVendors || 0);
        this.products.set(data.totalProducts || 0);
        this.totalOrders.set(data.totalOrders || 0);
        this.totalRevenue.set(data.totalRevenue || 0);
        this.pendingProducts.set(data.pendingProducts || 0);
        this.orders.set(data.recentOrders || []);
      },
      error: () => {
        console.error('Failed to load admin dashboard');
      }
    });
  }
}
