import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule, 
    MatButtonModule, 
    MatCardModule, 
    MatTableModule, 
    MatChipsModule, 
    MatSelectModule, 
    MatMenuModule,
    MatSnackBarModule
  ],
  template: `
    <div class="orders-page" [class.has-selection]="selectedOrder()">
      <div class="page-header">
        <h1>Vendor Orders</h1>
      </div>
      
      <div class="content-container">
        <!-- Orders List Panel -->
        <mat-card class="list-card">
          <mat-card-content class="table-container">
            <table mat-table [dataSource]="orders()" class="orders-table">
              <ng-container matColumnDef="orderId">
                <th mat-header-cell *matHeaderCellDef>Order ID</th>
                <td mat-cell *matCellDef="let order" class="order-number">#{{order.orderNumber}}</td>
              </ng-container>
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let order">{{order.customerName || order.customer?.firstName || 'N/A'}}</td>
              </ng-container>
              <ng-container matColumnDef="items">
                <th mat-header-cell *matHeaderCellDef>Items</th>
                <td mat-cell *matCellDef="let order">{{order.items?.length || 0}}</td>
              </ng-container>
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let order">{{order.total || order.totalAmount | currency:'INR'}}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let order">
                  <span class="status-badge {{order.status?.toLowerCase()}}">{{order.status}}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let order">{{order.createdAt | date:'shortDate'}}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let order">
                  <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()" title="Actions">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="selectOrder(order)">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item (click)="openStatusModal(order)">
                      <mat-icon>edit</mat-icon>
                      <span>Update Status</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  [class.selected-row]="(selectedOrder()?.id || selectedOrder()?._id) === (row.id || row._id)"
                  (click)="selectOrder(row)"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Order Detail Panel -->
        <mat-card class="detail-card" *ngIf="selectedOrder() as order">
          <mat-card-header class="detail-header">
            <div class="detail-title-group">
              <mat-card-title>Order Detail</mat-card-title>
              <mat-card-subtitle>#{{order.orderNumber}}</mat-card-subtitle>
            </div>
            <button mat-icon-button class="close-btn" (click)="closeDetail()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-card-header>
          
          <mat-card-content class="detail-content">
            @if (loadingDetail()) {
              <div class="loading-spinner">Loading order details...</div>
            } @else if (detailedOrder()) {
              @let detail = detailedOrder();
              <!-- Customer & Shipping Section -->
              <div class="detail-section">
                <h3>Customer & Shipping Details</h3>
                <div class="detail-grid">
                  <div class="grid-item">
                    <span class="grid-label">Customer Name:</span>
                    <span class="grid-val">{{detail.shippingFullName || 'N/A'}}</span>
                  </div>
                  <div class="grid-item">
                    <span class="grid-label">Phone:</span>
                    <span class="grid-val">{{detail.shippingPhone || 'N/A'}}</span>
                  </div>
                  <div class="grid-item full-width">
                    <span class="grid-label">Shipping Address:</span>
                    <span class="grid-val">
                      {{detail.shippingAddressLine1}}
                      <span *ngIf="detail.shippingAddressLine2">, {{detail.shippingAddressLine2}}</span><br/>
                      {{detail.shippingCity}}, {{detail.shippingState}} - {{detail.shippingPincode}}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Order Items Section -->
              <div class="detail-section">
                <h3>Order Items ({{detail.items?.length || 0}})</h3>
                <div class="items-list">
                  <div class="item-row" *ngFor="let item of detail.items">
                    <img [src]="item.productImageUrl || 'assets/placeholder-product.png'" class="item-img" alt="product">
                    <div class="item-details">
                      <span class="item-name">{{item.productName}}</span>
                      <span class="item-variant" *ngIf="item.variantName">{{item.variantName}}</span>
                      <span class="item-qty">{{item.price | currency:'INR'}} x {{item.quantity}}</span>
                    </div>
                    <span class="item-price">{{item.subtotal | currency:'INR'}}</span>
                  </div>
                </div>
              </div>

              <!-- Summary Section -->
              <div class="detail-section">
                <h3>Order Summary</h3>
                <div class="summary-table">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>{{detail.subtotal | currency:'INR'}}</span>
                  </div>
                  <div class="summary-row" *ngIf="detail.discountAmount">
                    <span>Discount</span>
                    <span class="discount-val">-{{detail.discountAmount | currency:'INR'}}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span>{{detail.shippingCost | currency:'INR'}}</span>
                  </div>
                  <div class="summary-row total-row">
                    <span>Total Amount</span>
                    <span>{{detail.totalAmount | currency:'INR'}}</span>
                  </div>
                  <div class="payment-meta">
                    <div>
                      <span class="meta-label">Payment Method:</span>
                      <span class="meta-val">{{detail.paymentMethod | uppercase}}</span>
                    </div>
                    <div>
                      <span class="meta-label">Payment Status:</span>
                      <span class="status-badge status-{{detail.paymentStatus?.toLowerCase()}}">{{detail.paymentStatus}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Timeline -->
              <div class="detail-section" *ngIf="detail.tracking && detail.tracking.length > 0">
                <h3>Tracking Timeline</h3>
                <div class="timeline">
                  <div class="timeline-event" *ngFor="let event of detail.tracking">
                    <div class="event-icon-container">
                      <mat-icon class="event-icon">fiber_manual_record</mat-icon>
                    </div>
                    <div class="event-body">
                      <div class="event-header">
                        <span class="event-status">{{event.status}}</span>
                        <span class="event-time">{{event.timestamp | date:'short'}}</span>
                      </div>
                      <p class="event-desc">{{event.description}}</p>
                      <span class="event-loc" *ngIf="event.location">
                        <mat-icon>place</mat-icon> {{event.location}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Status Change Popup Modal -->
    @if (statusUpdateOrder()) {
      <div class="custom-modal-backdrop" (click)="closeStatusModal()">
        <div class="custom-modal-content" (click)="$event.stopPropagation()">
          <h3>Update Status for #{{statusUpdateOrder().orderNumber}}</h3>
          
          <div class="form-group">
            <label>New Status</label>
            <select class="custom-select" [(ngModel)]="modalStatus">
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>

          <div class="form-group">
            <label>Current Location (Optional)</label>
            <input type="text" class="custom-input" [(ngModel)]="modalLocation" placeholder="e.g. Warehouse, In Transit">
          </div>

          <div class="form-group">
            <label>Notes / Description (Optional)</label>
            <textarea class="custom-input" [(ngModel)]="modalDescription" placeholder="e.g. Order updated" rows="2"></textarea>
          </div>

          <div class="modal-actions">
            <button mat-button (click)="closeStatusModal()">Cancel</button>
            <button mat-flat-button color="primary" [disabled]="submitting()" (click)="submitStatusUpdate()">Update Status</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .orders-page { max-width: 1200px; margin: 0 auto; padding: 16px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 600; color: #1a237e; margin: 0; }
    
    .content-container { display: flex; gap: 24px; align-items: flex-start; }
    .list-card { flex: 1; min-width: 0; }
    .table-container { padding: 0 !important; overflow-x: auto; }
    .orders-table { width: 100%; }
    th { font-weight: 600; color: rgba(0,0,0,0.7); }
    td { vertical-align: middle; padding: 12px; }
    
    .order-number { font-family: monospace; font-size: 13px; font-weight: 600; color: #1a237e; }
    .selected-row { background-color: rgba(26, 35, 126, 0.05); }
    .orders-table tr[mat-row]:hover { background-color: rgba(0, 0, 0, 0.03); cursor: pointer; }
    .orders-table tr.selected-row:hover { background-color: rgba(26, 35, 126, 0.08); }

    /* Status Badges */
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: uppercase; }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.confirmed { background: #e8f5e9; color: #1b5e20; }
    .status-badge.processing { background: #e3f2fd; color: #0d47a1; }
    .status-badge.shipped { background: #f3e5f5; color: #4a148c; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .status-badge.returned { background: #efebe9; color: #4e342e; }

    /* Layout when order is selected */
    .orders-page.has-selection .content-container { display: grid; grid-template-columns: 55% 45%; }
    @media (max-width: 992px) {
      .orders-page.has-selection .content-container { display: flex; flex-direction: column; }
      .detail-card { width: 100%; }
    }

    /* Detail Card styles */
    .detail-card { max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 24px 8px; border-bottom: 1px solid rgba(0,0,0,0.08); }
    .detail-title-group { display: flex; flex-direction: column; }
    .detail-title-group mat-card-title { font-size: 20px; font-weight: 600; color: #1a237e; }
    .detail-title-group mat-card-subtitle { font-family: monospace; font-size: 14px; margin-top: 4px; }
    .close-btn { margin-top: -8px; margin-right: -8px; }

    .detail-content { padding: 16px 24px 24px !important; }
    .detail-section { margin-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 16px; }
    .detail-section:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .detail-section h3 { margin: 0 0 16px; font-size: 13px; font-weight: 600; color: #37474f; text-transform: uppercase; letter-spacing: 0.5px; }

    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
    .grid-item { display: flex; flex-direction: column; }
    .grid-item.full-width { grid-column: span 2; }
    .grid-label { font-size: 11px; color: #757575; font-weight: 500; text-transform: uppercase; }
    .grid-val { font-size: 14px; color: #212121; font-weight: 500; margin-top: 2px; }

    /* Order Items */
    .items-list { display: flex; flex-direction: column; gap: 12px; }
    .item-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px dashed rgba(0,0,0,0.06); }
    .item-row:last-child { border-bottom: none; }
    .item-img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; background: #f5f5f5; }
    .item-details { flex: 1; display: flex; flex-direction: column; }
    .item-name { font-size: 14px; font-weight: 500; color: #212121; }
    .item-variant { font-size: 12px; color: #757575; }
    .item-qty { font-size: 12px; color: #757575; margin-top: 2px; }
    .item-price { font-size: 14px; font-weight: 600; color: #212121; }

    /* Summary Table */
    .summary-table { display: flex; flex-direction: column; gap: 8px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #616161; }
    .discount-val { color: #2e7d32; font-weight: 500; }
    .total-row { border-top: 1px solid rgba(0,0,0,0.08); padding-top: 8px; margin-top: 4px; font-size: 16px; font-weight: 600; color: #212121; }
    .payment-meta { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; background: #f9f9f9; padding: 12px; border-radius: 6px; }
    .payment-meta > div { display: flex; justify-content: space-between; align-items: center; }
    .meta-label { font-size: 12px; color: #616161; }
    .meta-val { font-size: 13px; font-weight: 600; }

    /* Timeline */
    .timeline { display: flex; flex-direction: column; gap: 16px; padding-left: 8px; }
    .timeline-event { display: flex; gap: 12px; position: relative; }
    .timeline-event::after { content: ''; position: absolute; left: 11px; top: 24px; bottom: -20px; width: 2px; background: rgba(0,0,0,0.08); }
    .timeline-event:last-child::after { display: none; }
    .event-icon-container { width: 24px; display: flex; justify-content: center; z-index: 1; }
    .event-icon { font-size: 16px; width: 16px; height: 16px; color: #1a237e; background: white; }
    .event-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .event-header { display: flex; justify-content: space-between; align-items: baseline; }
    .event-status { font-weight: 600; font-size: 14px; text-transform: uppercase; color: #212121; }
    .event-time { font-size: 11px; color: #757575; }
    .event-desc { margin: 0; font-size: 13px; color: #616161; line-height: 1.4; }
    .event-loc { font-size: 12px; color: #757575; font-weight: 500; display: flex; align-items: center; gap: 4px; }
    .event-loc mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .loading-spinner { text-align: center; padding: 24px; color: #757575; font-style: italic; }

    /* Custom Modal CSS */
    .custom-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .custom-modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .custom-modal-content h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a237e;
    }
    .form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 11px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .custom-select, .custom-input {
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .custom-select:focus, .custom-input:focus {
      border-color: #1a237e;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
      .grid-item.full-width { grid-column: 1; }
      .orders-page { padding: 12px; }
      .item-row { flex-wrap: wrap; }
      .item-price { width: 100%; text-align: left; }
    }
  `]
})
export class VendorOrdersComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);

  orders = signal<any[]>([]);
  displayedColumns = ['orderId', 'customer', 'items', 'total', 'status', 'date', 'actions'];

  selectedOrder = signal<any | null>(null);
  detailedOrder = signal<any | null>(null);
  loadingDetail = signal(false);

  // Status modal signals/variables
  statusUpdateOrder = signal<any | null>(null);
  modalStatus = '';
  modalLocation = '';
  modalDescription = '';
  submitting = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.apiData.getVendorOrders(0).subscribe({
      next: (data) => {
        const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.orders.set(sorted);
        
        const currentSelected = this.selectedOrder();
        if (currentSelected) {
          const updated = sorted.find((o: any) => (o.id || o._id) === (currentSelected.id || currentSelected._id));
          if (updated) {
            this.selectedOrder.set(updated);
            this.loadDetailedOrder(Number(updated.id || updated._id));
          }
        }
      },
      error: () => this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 })
    });
  }

  selectOrder(order: any): void {
    this.selectedOrder.set(order);
    this.loadDetailedOrder(Number(order.id || order._id));
  }

  loadDetailedOrder(orderId: number): void {
    this.loadingDetail.set(true);
    this.apiData.getOrderById(orderId).subscribe({
      next: (data) => {
        this.detailedOrder.set(data);
        this.loadingDetail.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load detailed order information', 'Close', { duration: 3000 });
        this.loadingDetail.set(false);
      }
    });
  }

  closeDetail(): void {
    this.selectedOrder.set(null);
    this.detailedOrder.set(null);
  }

  openStatusModal(order: any): void {
    this.statusUpdateOrder.set(order);
    this.modalStatus = order.status?.toUpperCase() || 'PENDING';
    this.modalLocation = '';
    this.modalDescription = '';
  }

  closeStatusModal(): void {
    this.statusUpdateOrder.set(null);
  }

  submitStatusUpdate(): void {
    const order = this.statusUpdateOrder();
    if (!order) return;

    this.submitting.set(true);
    this.apiData.updateVendorOrderStatus(
      Number(order.id || order._id),
      this.modalStatus,
      this.modalDescription || `Order status updated to ${this.modalStatus} by vendor`,
      this.modalLocation
    ).subscribe({
      next: () => {
        this.snackBar.open('Order status updated successfully', 'Close', { duration: 3000 });
        this.submitting.set(false);
        this.closeStatusModal();
        this.loadOrders();
      },
      error: () => {
        this.snackBar.open('Failed to update order status', 'Close', { duration: 3000 });
        this.submitting.set(false);
      }
    });
  }
}
