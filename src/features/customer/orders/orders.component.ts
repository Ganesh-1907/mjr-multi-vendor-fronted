import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatTabsModule, MatChipsModule],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="All Orders ({{allOrders.length}})">
              <div class="orders-list">
                @for (order of allOrders; track order.id) {
                  <div class="order-item" [routerLink]="['/customer/orders', order.id]">
                    <div class="order-header">
                      <div class="order-meta">
                        <span class="order-id">{{order.orderNumber}}</span>
                        <span class="order-date">{{order.createdAt | date:'mediumDate'}}</span>
                      </div>
                      <span class="status-badge {{order.status}}">{{order.status}}</span>
                    </div>
                    <div class="order-items">
                      @for (item of order.items.slice(0, 3); track item.productId) {
                        <img [src]="item.productImage" [alt]="item.productName">
                      }
                      @if (order.items.length > 3) {
                        <span class="more-items">+{{order.items.length - 3}}</span>
                      }
                    </div>
                    <div class="order-total">{{order.total | currency:'INR'}}</div>
                  </div>
                }
              </div>
            </mat-tab>
            <mat-tab label="Pending ({{pendingOrders.length}})">
              <div class="orders-list">
                @for (order of pendingOrders; track order.id) {
                  <div class="order-item" [routerLink]="['/customer/orders', order.id]">
                    <div class="order-header">
                      <span class="order-id">{{order.orderNumber}}</span>
                      <span class="status-badge {{order.status}}">{{order.status}}</span>
                    </div>
                    <div class="order-total">{{order.total | currency:'INR'}}</div>
                  </div>
                }
              </div>
            </mat-tab>
            <mat-tab label="Completed ({{completedOrders.length}})">
              <div class="orders-list">
                @for (order of completedOrders; track order.id) {
                  <div class="order-item" [routerLink]="['/customer/orders', order.id]">
                    <div class="order-header">
                      <span class="order-id">{{order.orderNumber}}</span>
                      <span class="status-badge delivered">Delivered</span>
                    </div>
                    <div class="order-total">{{order.total | currency:'INR'}}</div>
                  </div>
                }
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-page { max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; margin-bottom: 8px; }
    .orders-list { padding: 16px 0; }
    .order-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-bottom: 1px solid #eee; cursor: pointer; }
    .order-item:hover { background: #f5f5f5; }
    .order-header { flex: 1; display: flex; align-items: center; justify-content: space-between; }
    .order-meta { display: flex; flex-direction: column; gap: 4px; }
    .order-id { font-weight: 600; color: #1a237e; }
    .order-date { font-size: 13px; color: #757575; }
    .order-items { display: flex; gap: 8px; }
    .order-items img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }
    .more-items { width: 48px; height: 48px; border: 2px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #757575; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.pending, .status-badge.processing { background: #fff3e0; color: #e65100; }
    .status-badge.shipped { background: #e3f2fd; color: #1565c0; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .order-total { font-weight: 600; }
  `]
})
export class CustomerOrdersComponent {
  dataService = inject(DataService);
  allOrders: Order[] = this.dataService.getOrders();
  pendingOrders = this.allOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));
  completedOrders = this.allOrders.filter(o => o.status === 'delivered');
}
