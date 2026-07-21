import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ApiDataService, Order } from '../../../core/services/api-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule],
  template: `
    <div class="reports-page fade-in">
      <div class="page-header"><h1>Reports & Analytics</h1></div>
      <div class="stats-grid">
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>payments</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{totalRevenue() || 0 | currency:env.currencyCode}}</span>
              <span class="stat-label">Total Revenue</span>
            }
          </div></div>
        </mat-card-content></mat-card>
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>shopping_cart</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{orderCount() || 0}}</span>
              <span class="stat-label">Total Orders</span>
            }
          </div></div>
        </mat-card-content></mat-card>
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>trending_up</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{avgOrderValue() || 0 | currency:env.currencyCode}}</span>
              <span class="stat-label">Avg Order Value</span>
            }
          </div></div>
        </mat-card-content></mat-card>
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>people</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{customerCount() || 0}}</span>
              <span class="stat-label">Total Customers</span>
            }
          </div></div>
        </mat-card-content></mat-card>
      </div>
      <mat-card class="chart-card hover-elevate">
        <mat-card-header><mat-card-title>Revenue by Month</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="chart-bars">
            @if (loading()) {
              <div class="skeleton-chart"></div>
            } @else if (monthlyData().length === 0) {
              <div class="empty-state" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary);">
                <mat-icon style="font-size: 48px; width: 48px; height: 48px; opacity: 0.5; margin-bottom: 8px;">bar_chart</mat-icon>
                <p>No revenue data available yet.</p>
              </div>
            } @else {
              @for (month of monthlyData(); track month.name) {
                <div class="bar-item bar-animate" [style.animation-delay]="$index * 0.1 + 's'">
                  <div class="bar" [style.height.%]="month.percentage"></div>
                  <span class="label">{{month.name}}</span>
                </div>
              }
            }
          </div>
        </mat-card-content>
      </mat-card>
      <div class="export-section">
        <h2>Export Data</h2>
        <div class="export-buttons">
          <button mat-raised-button color="primary" (click)="exportOrders()" [disabled]="loading()">
            <mat-icon>file_download</mat-icon> Export Orders
          </button>
          <button mat-raised-button color="primary" (click)="exportCustomers()" [disabled]="loading()">
            <mat-icon>file_download</mat-icon> Export Customers
          </button>
          <button mat-raised-button color="primary" (click)="exportProducts()" [disabled]="loading()">
            <mat-icon>file_download</mat-icon> Export Products
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { max-width: 1200px; margin: 0 auto; padding: 16px; }
    .page-header { margin-bottom: 24px; color: var(--text-primary); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    mat-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-elevate:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .stat { display: flex; align-items: center; gap: 16px; padding: 16px; }
    .stat > div { display: flex; flex-direction: column; flex: 1; }
    .stat mat-icon { font-size: 36px; color: var(--primary); width: 36px; height: 36px; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 13px; color: var(--text-secondary); }
    .chart-card { margin-bottom: 24px; }
    .chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 200px; padding: 20px 0; width: 100%; position: relative; }
    .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 40px; opacity: 0; animation: slideUp 0.6s ease-out forwards; }
    .bar { width: 30px; background: linear-gradient(180deg, var(--primary) 0%, #3949ab 100%); border-radius: 4px 4px 0 0; min-height: 10px; transition: height 1s ease-out; }
    .bar:hover { filter: brightness(1.2); }
    .label { font-size: 10px; color: var(--text-secondary); margin-top: 8px; font-weight: 500; }
    .export-section h2 { margin-bottom: 16px; color: var(--text-primary); }
    .export-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
    .export-buttons button { display: flex; align-items: center; gap: 8px; }
    
    .skeleton-text { background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-value { height: 28px; width: 70%; margin-bottom: 4px; }
    .skeleton-label { height: 14px; width: 50%; }
    .skeleton-chart { position: absolute; inset: 0; background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) {
      .stats-grid { gap: 12px; }
      .chart-bars { height: 150px; }
      .export-buttons { flex-direction: column; }
      .export-buttons button { width: 100%; }
    }
  `]
})
export class AdminReportsComponent implements OnInit {
  apiDataService = inject(ApiDataService);

  dashboard = signal<any>({});
  orders = signal<Order[]>([]);
  loading = signal(true);
  
  apiTotalRevenue = signal<number | null>(null);
  
  totalRevenue = computed(() => {
    const apiRev = this.apiTotalRevenue();
    if (apiRev !== null) return apiRev;
    return this.orders().reduce((sum, o) => sum + o.totalAmount, 0);
  });
  
  orderCount = computed(() => this.orders().length);
  avgOrderValue = computed(() => this.orders().length ? this.totalRevenue() / this.orders().length : 0);
  customerCount = signal(0);
  monthlyData = signal<any[]>([]);
  env = environment;

  ngOnInit(): void {
    Promise.allSettled([
      new Promise(resolve => this.apiDataService.getAdminDashboard().subscribe({ next: resolve, error: resolve })),
      new Promise(resolve => this.apiDataService.getAdminOrders().subscribe({ next: resolve, error: resolve }))
    ]).then((results: any[]) => {
      if (results[0].status === 'fulfilled' && results[0].value) {
        const data = results[0].value;
        this.dashboard.set(data);
        if (data?.totalCustomers !== undefined) this.customerCount.set(data.totalCustomers);
        if (data?.monthlyRevenue !== undefined) this.monthlyData.set(data.monthlyRevenue);
        if (data?.totalRevenue !== undefined) this.apiTotalRevenue.set(data.totalRevenue);
      }
      
      if (results[1].status === 'fulfilled' && results[1].value) {
        this.orders.set(results[1].value);
      }
      
      this.loading.set(false);
    });
  }

  exportOrders(): void {
    const data = this.orders().map(o => ({
      OrderNumber: o.orderNumber,
      Customer: o.customerName,
      Amount: o.totalAmount,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString()
    }));
    this.downloadCSV(data, 'orders_export.csv');
  }

  exportCustomers(): void {
    this.apiDataService.getAdminUsers().subscribe(users => {
      const customers = users.filter(u => u.role?.name === 'CUSTOMER');
      const data = customers.map(c => ({
        Name: `${c.firstName} ${c.lastName}`,
        Email: c.email,
        Joined: new Date(c.createdAt).toLocaleDateString()
      }));
      this.downloadCSV(data, 'customers_export.csv');
    });
  }

  exportProducts(): void {
    this.apiDataService.getAdminProducts().subscribe(products => {
      const data = products.map(p => ({
        Name: p.name,
        Category: p.category?.name || '',
        Vendor: p.vendor?.storeName || '',
        Status: p.status
      }));
      this.downloadCSV(data, 'products_export.csv');
    });
  }

  private downloadCSV(data: any[], filename: string): void {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => 
      Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
