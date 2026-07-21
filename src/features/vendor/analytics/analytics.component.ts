import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vendor-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatProgressBarModule],
  template: `
    <div class="analytics-page fade-in">
      <div class="page-header"><h1>Analytics & Reports</h1></div>
      <div class="stats-grid">
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>trending_up</mat-icon><div>
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
              <span class="stat-value">{{totalOrders() || 0}}</span>
              <span class="stat-label">Total Orders</span>
            }
          </div></div>
        </mat-card-content></mat-card>
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>avg_pricing</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{avgOrderValue() || 0 | currency:env.currencyCode}}</span>
              <span class="stat-label">Avg. Order Value</span>
            }
          </div></div>
        </mat-card-content></mat-card>
        <mat-card class="hover-elevate"><mat-card-content>
          <div class="stat"><mat-icon>star</mat-icon><div>
            @if (loading()) {
              <div class="skeleton-text skeleton-value"></div>
              <div class="skeleton-text skeleton-label"></div>
            } @else {
              <span class="stat-value">{{storeRating() || 0 | number:'1.1-1'}}</span>
              <span class="stat-label">Store Rating</span>
            }
          </div></div>
        </mat-card-content></mat-card>
      </div>
      <mat-card class="chart-placeholder hover-elevate">
        <mat-card-header><mat-card-title>Monthly Sales</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="chart-bars">
            @if (loading()) {
              <div class="skeleton-chart"></div>
            } @else if (monthlyData().length === 0) {
              <div class="empty-state" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-secondary);">
                <mat-icon style="font-size: 48px; width: 48px; height: 48px; opacity: 0.5; margin-bottom: 8px;">bar_chart</mat-icon>
                <p>No sales data available yet.</p>
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
      <mat-card class="top-products hover-elevate">
        <mat-card-header><mat-card-title>Top Products</mat-card-title></mat-card-header>
        <mat-card-content style="min-height: 150px; position: relative;">
          @if (loading()) {
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          } @else if (topProducts().length === 0) {
            <div class="empty-state" style="padding: 32px; text-align: center; color: var(--text-secondary);">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px; opacity: 0.5; margin-bottom: 8px;">inventory</mat-icon>
              <p>No top products found.</p>
            </div>
          } @else {
            @for (product of topProducts(); track product.name) {
              <div class="product-item table-row-animate">
                <img [src]="product.image || env.placeholderImage" (error)="$any($event.target).src=env.placeholderImage">
                <div class="info"><p class="name">{{product.name}}</p><p class="sold">{{product.sold || 0}} sold</p></div>
                <span class="revenue">{{(product.revenue || 0) | currency:env.currencyCode}}</span>
              </div>
            }
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .analytics-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; color: var(--text-primary); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    mat-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-elevate:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .stat { display: flex; align-items: center; gap: 16px; padding: 16px; }
    .stat > div { display: flex; flex-direction: column; flex: 1; }
    .stat mat-icon { font-size: 36px; color: var(--primary); width: 36px; height: 36px; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 13px; color: var(--text-secondary); }
    .chart-placeholder { margin-bottom: 24px; }
    .chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 200px; padding: 20px 0; width: 100%; position: relative; }
    .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 40px; opacity: 0; animation: slideUp 0.6s ease-out forwards; }
    .bar { width: 30px; background: linear-gradient(180deg, var(--primary) 0%, #3949ab 100%); border-radius: 4px 4px 0 0; min-height: 10px; transition: height 1s ease-out; }
    .bar:hover { filter: brightness(1.2); }
    .label { font-size: 10px; color: var(--text-secondary); margin-top: 8px; font-weight: 500; }
    .product-item { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
    .product-item:last-child { border-bottom: none; }
    .product-item img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }
    .product-item .info { flex: 1; }
    .product-item .name { font-weight: 500; margin-bottom: 4px; color: var(--text-primary); }
    .product-item .sold { font-size: 13px; color: var(--text-secondary); }
    .product-item .revenue { font-weight: 600; color: var(--primary); }

    .skeleton-text { background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-value { height: 28px; width: 70%; margin-bottom: 4px; }
    .skeleton-label { height: 14px; width: 50%; }
    .skeleton-chart { position: absolute; inset: 0; background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    .table-row-animate { animation: fadeIn 0.4s ease-out; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class VendorAnalyticsComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  env = environment;

  loading = signal(true);
  orders = signal<any[]>([]);
  
  apiTotalRevenue = signal<number | null>(null);
  totalRevenue = computed(() => {
    const apiRev = this.apiTotalRevenue();
    if (apiRev !== null) return apiRev;
    return this.orders().reduce((sum: number, o: any) => sum + (o.total || o.totalAmount || 0), 0);
  });
  
  totalOrders = computed(() => this.orders().length);
  avgOrderValue = computed(() => this.totalOrders() ? this.totalRevenue() / this.totalOrders() : 0);
  storeRating = signal(0);

  monthlyData = signal<any[]>([]);
  topProducts = signal<any[]>([]);

  ngOnInit(): void {
    Promise.allSettled([
      new Promise(resolve => this.apiData.getVendorAnalytics().subscribe({ next: resolve, error: resolve })),
      new Promise(resolve => this.apiData.getVendorOrders(0).subscribe({ next: resolve, error: resolve }))
    ]).then((results: any[]) => {
      if (results[0].status === 'fulfilled' && results[0].value) {
        const data = results[0].value;
        if (data.orders) this.orders.set(data.orders);
        if (data.storeRating !== undefined) this.storeRating.set(data.storeRating);
        else if (data.rating !== undefined) this.storeRating.set(data.rating);
        else if (data.vendor?.rating !== undefined) this.storeRating.set(data.vendor.rating);
        
        if (data.monthlyData) this.monthlyData.set(data.monthlyData);
        if (data.topProducts) this.topProducts.set(data.topProducts);
        if (data.totalRevenue !== undefined) this.apiTotalRevenue.set(data.totalRevenue);
      }
      
      if (results[1].status === 'fulfilled' && results[1].value) {
        const data = results[1].value;
        // Only set orders from this API if analytics didn't provide them
        if (!this.orders().length && Array.isArray(data)) {
          this.orders.set(data);
        }
      }
      
      this.loading.set(false);
    });
  }
}
