import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-vendor-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatProgressBarModule],
  template: `
    <div class="analytics-page">
      <div class="page-header"><h1>Analytics & Reports</h1></div>
      <div class="stats-grid">
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>trending_up</mat-icon><div>
            <span class="stat-value">{{totalRevenue | currency:'INR'}}</span>
            <span class="stat-label">Total Revenue</span>
          </div></div>
        </mat-card-content></mat-card>
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>shopping_cart</mat-icon><div>
            <span class="stat-value">{{orders.length}}</span>
            <span class="stat-label">Total Orders</span>
          </div></div>
        </mat-card-content></mat-card>
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>avg_pricing</mat-icon><div>
            <span class="stat-value">{{avgOrderValue | currency:'INR'}}</span>
            <span class="stat-label">Avg. Order Value</span>
          </div></div>
        </mat-card-content></mat-card>
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>star</mat-icon><div>
            <span class="stat-value">{{vendor?.rating | number:'1.1-1'}}</span>
            <span class="stat-label">Store Rating</span>
          </div></div>
        </mat-card-content></mat-card>
      </div>
      <mat-card class="chart-placeholder">
        <mat-card-header><mat-card-title>Monthly Sales</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="chart-bars">
            @for (month of monthlyData; track month.name) {
              <div class="bar-item">
                <div class="bar" [style.height.%]="month.percentage"></div>
                <span class="label">{{month.name}}</span>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card class="top-products">
        <mat-card-header><mat-card-title>Top Products</mat-card-title></mat-card-header>
        <mat-card-content>
          @for (product of topProducts; track product.name) {
            <div class="product-item">
              <img [src]="product.image">
              <div class="info"><p class="name">{{product.name}}</p><p class="sold">{{product.sold}} sold</p></div>
              <span class="revenue">{{product.revenue | currency:'INR'}}</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .analytics-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat { display: flex; align-items: center; gap: 16px; padding: 16px; }
    .stat mat-icon { font-size: 36px; color: #1a237e; }
    .stat-value { font-size: 24px; font-weight: 700; }
    .stat-label { font-size: 13px; color: #757575; }
    .chart-placeholder { margin-bottom: 24px; }
    .chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 200px; padding: 20px 0; }
    .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 40px; }
    .bar { width: 30px; background: linear-gradient(180deg, #1a237e 0%, #3949ab 100%); border-radius: 4px 4px 0 0; min-height: 10px; }
    .label { font-size: 10px; color: #757575; margin-top: 8px; }
    .product-item { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eee; }
    .product-item img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }
    .product-item .info { flex: 1; }
    .product-item .name { font-weight: 500; margin-bottom: 4px; }
    .product-item .sold { font-size: 13px; color: #757575; }
    .product-item .revenue { font-weight: 600; color: #1a237e; }
  `]
})
export class VendorAnalyticsComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);

  vendor = this.dataService.getVendorById(this.auth.currentUser()?.id || '');
  orders: Order[] = this.vendor ? this.dataService.getOrdersByVendor(this.vendor.id) : [];

  totalRevenue = this.orders.reduce((sum, o) => sum + o.total, 0);
  avgOrderValue = this.orders.length ? this.totalRevenue / this.orders.length : 0;

  monthlyData = [
    { name: 'Jan', percentage: 45 }, { name: 'Feb', percentage: 60 }, { name: 'Mar', percentage: 55 },
    { name: 'Apr', percentage: 70 }, { name: 'May', percentage: 80 }, { name: 'Jun', percentage: 90 }
  ];

  topProducts = [
    { name: 'iPhone 15 Pro Max', sold: 45, revenue: 6000000, image: 'https://images.pexels.com/photos/7889460/pexels-photo-7889460.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Samsung Galaxy S24 Ultra', sold: 38, revenue: 5000000, image: 'https://images.pexels.com/photos/607835/pexels-photo-607835.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'MacBook Pro', sold: 15, revenue: 3750000, image: 'https://images.pexels.com/photos/18105315/pexels-photo-18105315.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];
}
