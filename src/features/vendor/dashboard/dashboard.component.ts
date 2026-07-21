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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatProgressBarModule, MatDividerModule],
  template: `
    <div class="dashboard-home fade-in">
      <div class="welcome-section">
        <h1>Welcome, {{auth.currentUser()?.firstName || 'Vendor'}}!</h1>
        <p>Here's your store performance overview.</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card hover-elevate">
          <mat-card-content>
            <mat-icon>inventory_2</mat-icon>
            <div class="stat-info">
              @if (loading()) {
                <div class="skeleton-text skeleton-value"></div>
                <div class="skeleton-text skeleton-label"></div>
              } @else {
                <span class="stat-value">{{products().length || 0}}</span>
                <span class="stat-label">Total Products</span>
              }
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card hover-elevate">
          <mat-card-content>
            <mat-icon>receipt_long</mat-icon>
            <div class="stat-info">
              @if (loading()) {
                <div class="skeleton-text skeleton-value"></div>
                <div class="skeleton-text skeleton-label"></div>
              } @else {
                <span class="stat-value">{{orders().length || 0}}</span>
                <span class="stat-label">Total Orders</span>
              }
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card revenue hover-elevate">
          <mat-card-content>
            <mat-icon>payments</mat-icon>
            <div class="stat-info">
              @if (loading()) {
                <div class="skeleton-text skeleton-value"></div>
                <div class="skeleton-text skeleton-label"></div>
              } @else {
                <span class="stat-value">{{totalRevenue() || 0 | currency:env.currencyCode}}</span>
                <span class="stat-label">Total Revenue</span>
              }
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card hover-elevate">
          <mat-card-content>
            <mat-icon>star</mat-icon>
            <div class="stat-info">
              @if (loading()) {
                <div class="skeleton-text skeleton-value"></div>
                <div class="skeleton-text skeleton-label"></div>
              } @else {
                <span class="stat-value">{{vendorRating() || 0 | number:'1.1-1'}}</span>
                <span class="stat-label">Store Rating</span>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="recent-orders-card hover-elevate">
        <mat-card-header>
          <mat-card-title>Recent Orders</mat-card-title>
          <a mat-button routerLink="/vendor/orders">View All</a>
        </mat-card-header>
        <mat-card-content class="table-wrapper">
          @if (loading()) {
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          }
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              @for (order of orders().slice(0, 5); track order.id) {
                <tr class="table-row-animate">
                  <td>{{order.orderNumber || 'N/A'}}</td>
                  <td>{{order.customerName || order.customer?.firstName || 'Guest'}}</td>
                  <td>{{(order.total || order.totalAmount || 0) | currency:env.currencyCode}}</td>
                  <td><span class="status-badge {{order.status?.toLowerCase()}}">{{order.status || 'Pending'}}</span></td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-state">
                    @if (!loading()) {
                      <mat-icon>inbox</mat-icon>
                      <p>No recent orders found.</p>
                    }
                  </td>
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
    .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-elevate:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 24px !important; }
    .stat-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--primary); }
    .stat-card.revenue mat-icon { color: #10b981; }
    .stat-info { display: flex; flex-direction: column; flex: 1; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .recent-orders-card { margin-bottom: 24px; transition: box-shadow 0.2s; }
    .table-wrapper { overflow-x: auto; padding: 0 !important; }
    table { width: 100%; border-collapse: collapse; white-space: nowrap; }
    th, td { padding: 16px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-primary); }
    th { font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); }
    .table-row-animate { animation: fadeIn 0.4s ease-out; }
    tr:hover { background-color: var(--bg-tertiary); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
    .status-badge.pending, .status-badge.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-badge.shipped { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .status-badge.delivered { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .empty-state { text-align: center; padding: 32px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.5; margin-bottom: 8px; }
    .skeleton-text { background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-value { height: 32px; width: 60%; margin-bottom: 4px; }
    .skeleton-label { height: 16px; width: 80%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .quick-actions h2 { font-size: 20px; margin-bottom: 16px; color: var(--text-primary); }
    .actions-grid { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class VendorDashboardComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  env = environment;

  loading = signal(true);
  products = signal<any[]>([]);
  orders = signal<any[]>([]);
  vendorRating = signal(0);
  
  // Use analytics data if available, fallback to manual calculation
  analyticsRevenue = signal<number | null>(null);
  totalRevenue = computed(() => {
    const apiRev = this.analyticsRevenue();
    if (apiRev !== null) return apiRev;
    return this.orders().reduce((sum: number, o: any) => sum + (o.total || o.totalAmount || 0), 0);
  });

  ngOnInit(): void {
    // Fire APIs concurrently
    Promise.allSettled([
      new Promise(resolve => this.apiData.getVendorProducts().subscribe({ next: resolve, error: resolve })),
      new Promise(resolve => this.apiData.getVendorOrders(0).subscribe({ next: resolve, error: resolve })),
      new Promise(resolve => this.apiData.getVendorAnalytics().subscribe({ next: resolve, error: resolve }))
    ]).then((results: any[]) => {
      // Process Products
      if (results[0].status === 'fulfilled' && results[0].value) {
        this.products.set(results[0].value);
      }
      
      // Process Orders
      if (results[1].status === 'fulfilled' && results[1].value) {
        this.orders.set(results[1].value);
      }
      
      // Process Analytics
      if (results[2].status === 'fulfilled' && results[2].value) {
        const data = results[2].value;
        if (data?.vendor?.rating) this.vendorRating.set(data.vendor.rating);
        else if (data?.rating) this.vendorRating.set(data.rating);
        
        if (data?.totalRevenue !== undefined) this.analyticsRevenue.set(data.totalRevenue);
      }
      
      this.loading.set(false);
    });
  }
}
