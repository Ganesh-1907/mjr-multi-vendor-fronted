import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule],
  template: `
    <div class="reports-page">
      <div class="page-header"><h1>Reports & Analytics</h1></div>
      <div class="stats-grid">
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>payments</mat-icon><div>
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
          <div class="stat"><mat-icon>trending_up</mat-icon><div>
            <span class="stat-value">{{avgOrderValue | currency:'INR'}}</span>
            <span class="stat-label">Avg Order Value</span>
          </div></div>
        </mat-card-content></mat-card>
        <mat-card><mat-card-content>
          <div class="stat"><mat-icon>users</mat-icon><div>
            <span class="stat-value">{{customers.length}}</span>
            <span class="stat-label">Total Customers</span>
          </div></div>
        </mat-card-content></mat-card>
      </div>
      <mat-card class="chart-card">
        <mat-card-header><mat-card-title>Revenue by Month</mat-card-title></mat-card-header>
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
      <div class="export-section">
        <h2>Export Data</h2>
        <div class="export-buttons">
          <button mat-raised-button><mat-icon>file_download</mat-icon> Export Orders</button>
          <button mat-raised-button><mat-icon>file_download</mat-icon> Export Customers</button>
          <button mat-raised-button><mat-icon>file_download</mat-icon> Export Products</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat { display: flex; align-items: center; gap: 16px; padding: 16px; }
    .stat mat-icon { font-size: 36px; color: #1a237e; }
    .stat-value { font-size: 24px; font-weight: 700; }
    .stat-label { font-size: 13px; color: #757575; }
    .chart-card { margin-bottom: 24px; }
    .chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 200px; padding: 20px 0; }
    .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 40px; }
    .bar { width: 30px; background: linear-gradient(180deg, #1a237e 0%, #3949ab 100%); border-radius: 4px 4px 0 0; min-height: 10px; }
    .label { font-size: 10px; color: #757575; margin-top: 8px; }
    .export-section h2 { margin-bottom: 16px; }
    .export-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
    .export-buttons button { display: flex; align-items: center; gap: 8px; }
  `]
})
export class AdminReportsComponent {
  dataService = inject(DataService);
  customers = this.dataService.getCustomers();
  orders = this.dataService.getOrders();
  totalRevenue = this.orders.reduce((sum, o) => sum + o.total, 0);
  avgOrderValue = this.orders.length ? this.totalRevenue / this.orders.length : 0;
  monthlyData = [
    { name: 'Jan', percentage: 45 }, { name: 'Feb', percentage: 60 }, { name: 'Mar', percentage: 55 },
    { name: 'Apr', percentage: 70 }, { name: 'May', percentage: 80 }, { name: 'Jun', percentage: 90 }
  ];
}
