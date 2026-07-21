import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiDataService } from '../../../core/services/api-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatCardModule, 
    MatTabsModule, 
    MatChipsModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-tab-group (selectedTabChange)="onTabChange($event)">
            <mat-tab label="All Orders ({{allOrders().length}})"></mat-tab>
            <mat-tab label="Pending / Uncompleted ({{uncompletedOrders().length}})"></mat-tab>
            <mat-tab label="Completed ({{completedOrders().length}})"></mat-tab>
            <mat-tab label="Cancelled ({{cancelledOrders().length}})"></mat-tab>
          </mat-tab-group>

          <div class="orders-list">
            <mat-accordion>
              @for (order of displayedOrders(); track order.id) {
                <mat-expansion-panel class="order-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <span class="order-number">#{{order.orderNumber}}</span>
                    </mat-panel-title>
                    <mat-panel-description>
                      <span class="order-date">{{order.createdAt | date:'mediumDate'}}</span>
                      <span class="order-total">{{order.totalAmount || order.total | currency:env.currencyCode}}</span>
                      <span class="status-badge {{order.status?.toLowerCase()}}">{{order.status}}</span>
                    </mat-panel-description>
                  </mat-expansion-panel-header>
                  
                  <div class="order-details-expanded">
                    <div class="details-section">
                      <h4>Items</h4>
                      <div class="order-items-grid">
                        @for (item of order.items; track item.id) {
                          <div class="order-item-row">
                            <img [src]="item.productImageUrl || env.placeholderImage" class="item-img" alt="product" (error)="$any($event.target).src=env.placeholderImage">
                            <div class="item-info">
                              <span class="item-name">{{item.productName}}</span>
                              <span class="item-qty">{{item.price | currency:env.currencyCode}} x {{item.quantity}}</span>
                            </div>
                            <span class="item-subtotal">{{item.subtotal | currency:env.currencyCode}}</span>
                          </div>
                        }
                      </div>
                    </div>

                    <div class="details-grid">
                      <div class="details-col">
                        <h4>Shipping Address</h4>
                        <p class="address-text">
                          <strong>{{order.shippingFullName || 'N/A'}}</strong><br/>
                          {{order.shippingAddressLine1}}<br/>
                          <span *ngIf="order.shippingAddressLine2">{{order.shippingAddressLine2}}<br/></span>
                          {{order.shippingCity}}, {{order.shippingState}} - {{order.shippingPincode}}<br/>
                          Phone: {{order.shippingPhone || 'N/A'}}
                        </p>
                      </div>
                      
                      <div class="details-col">
                        <h4>Payment Details</h4>
                        <p>Method: <strong>{{order.paymentMethod}}</strong></p>
                        <p>Status: <span class="payment-status status-{{order.paymentStatus?.toLowerCase()}}">{{order.paymentStatus}}</span></p>
                        
                        @if (['pending', 'confirmed'].includes(order.status?.toLowerCase())) {
                          <div class="cancel-action-container">
                            <button mat-flat-button color="warn" (click)="cancelOrder(order.id); $event.stopPropagation()">
                              <mat-icon>cancel</mat-icon> Cancel Order
                            </button>
                          </div>
                        }
                      </div>
                    </div>

                    @if (order.tracking && order.tracking.length > 0) {
                      <div class="details-section tracking-section">
                        <h4>Status History</h4>
                        <div class="tracking-timeline">
                          @for (track of order.tracking; track track.id) {
                            <div class="timeline-step">
                              <div class="step-marker"></div>
                              <div class="step-content">
                                <span class="step-status">{{track.status}}</span>
                                <span class="step-time">{{track.timestamp | date:'medium'}}</span>
                                <p class="step-desc">{{track.description}}</p>
                                <span class="step-loc" *ngIf="track.location"><mat-icon>place</mat-icon> {{track.location}}</span>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </mat-expansion-panel>
              } @empty {
                <div class="no-orders">No orders found.</div>
              }
            </mat-accordion>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-page { max-width: 1000px; margin: 0 auto; padding: 16px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 600; color: #1a237e; margin-bottom: 4px; }
    .page-header p { color: #666; margin: 0; }
    
    .orders-list { padding: 20px 0; }
    .order-panel { margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.05); box-shadow: none !important; border-radius: 8px !important; overflow: hidden; }
    
    .order-number { font-family: monospace; font-size: 15px; font-weight: 600; color: #1a237e; }
    .order-date { font-size: 14px; color: #666; margin-right: 16px; }
    .order-total { font-size: 15px; font-weight: 600; color: #212121; margin-right: 24px; }
    
    mat-panel-description { align-items: center; justify-content: flex-end; }
    
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: uppercase; }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.confirmed { background: #e8f5e9; color: #1b5e20; }
    .status-badge.processing { background: #e3f2fd; color: #0d47a1; }
    .status-badge.shipped { background: #f3e5f5; color: #4a148c; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .status-badge.returned { background: #efebe9; color: #4e342e; }
    
    .order-details-expanded { padding: 16px 8px; display: flex; flex-direction: column; gap: 24px; }
    
    h4 { margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #37474f; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    
    .order-item-row { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px dashed #eee; }
    .order-item-row:last-child { border-bottom: none; }
    .item-img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; background: #f5f5f5; }
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-name { font-weight: 500; color: #212121; }
    .item-qty { font-size: 13px; color: #666; margin-top: 2px; }
    .item-subtotal { font-weight: 600; }
    
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 600px) {
      .details-grid { grid-template-columns: 1fr; }
    }
    
    .address-text { line-height: 1.6; color: #37474f; margin: 0; }
    
    .payment-status { font-weight: 600; text-transform: uppercase; font-size: 12px; }
    .payment-status.status-completed, .payment-status.status-paid { color: #2e7d32; }
    .payment-status.status-pending { color: #e65100; }
    .payment-status.status-failed { color: #c62828; }
    
    .cancel-action-container { margin-top: 16px; }
    
    .no-orders { text-align: center; padding: 48px; color: #666; font-style: italic; }
    
    .tracking-timeline { display: flex; flex-direction: column; gap: 16px; padding-left: 8px; margin-top: 8px; }
    .timeline-step { display: flex; gap: 12px; position: relative; }
    .timeline-step::after { content: ''; position: absolute; left: 5px; top: 12px; bottom: -20px; width: 2px; background: #e0e0e0; }
    .timeline-step:last-child::after { display: none; }
    .step-marker { width: 12px; height: 12px; border-radius: 50%; background: #1a237e; margin-top: 4px; z-index: 1; }
    .step-content { flex: 1; display: flex; flex-direction: column; }
    .step-status { font-weight: 600; font-size: 14px; color: #212121; }
    .step-time { font-size: 11px; color: #757575; margin-top: 2px; }
    .step-desc { margin: 4px 0 0 0; font-size: 13px; color: #616161; }
    .step-loc { font-size: 12px; color: #757575; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
    .step-loc mat-icon { font-size: 14px; width: 14px; height: 14px; }
  `]
})
export class CustomerOrdersComponent implements OnInit {
  env = environment;
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);

  allOrders = signal<any[]>([]);
  activeTab = signal<'all' | 'uncompleted' | 'completed' | 'cancelled'>('all');

  uncompletedOrders = computed(() => 
    this.allOrders().filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status?.toLowerCase()))
  );
  
  completedOrders = computed(() => 
    this.allOrders().filter(o => o.status?.toLowerCase() === 'delivered')
  );
  
  cancelledOrders = computed(() => 
    this.allOrders().filter(o => o.status?.toLowerCase() === 'cancelled')
  );

  displayedOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'uncompleted') return this.uncompletedOrders();
    if (tab === 'completed') return this.completedOrders();
    if (tab === 'cancelled') return this.cancelledOrders();
    return this.allOrders();
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.apiData.getOrders().subscribe({
      next: (data) => this.allOrders.set(data),
      error: () => this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 })
    });
  }

  onTabChange(event: any): void {
    const indices: Record<number, 'all' | 'uncompleted' | 'completed' | 'cancelled'> = {
      0: 'all',
      1: 'uncompleted',
      2: 'completed',
      3: 'cancelled'
    };
    this.activeTab.set(indices[event.index] || 'all');
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.apiData.cancelOrder(orderId).subscribe({
        next: () => {
          this.snackBar.open('Order cancelled successfully', 'Close', { duration: 3000 });
          this.loadOrders();
        },
        error: () => this.snackBar.open('Failed to cancel order', 'Close', { duration: 3000 })
      });
    }
  }
}
