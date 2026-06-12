import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatSelectModule],
  template: `
    <div class="orders-page">
      <div class="page-header"><h1>Vendor Orders</h1></div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="orders" class="orders-table">
            <ng-container matColumnDef="orderId">
              <th mat-header-cell *matHeaderCellDef>Order ID</th>
              <td mat-cell *matCellDef="let order">{{order.orderNumber}}</td>
            </ng-container>
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let order">{{order.customerName}}</td>
            </ng-container>
            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef>Items</th>
              <td mat-cell *matCellDef="let order">{{order.items.length}}</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let order">{{order.total | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let order">
                <mat-chip [color]="getStatusColor(order.status)">{{order.status}}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let order">{{order.createdAt | date:'shortDate'}}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let order">
                <button mat-icon-button><mat-icon>visibility</mat-icon></button>
                <button mat-icon-button><mat-icon>local_shipping</mat-icon></button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .orders-table { width: 100%; }
    th, td { padding: 12px; }
    mat-chip { text-transform: capitalize; font-size: 12px; min-height: 24px; }
  `]
})
export class VendorOrdersComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);
  snackBar = inject(MatSnackBar);

  vendor = this.dataService.getVendorById(this.auth.currentUser()?.id || '');
  orders: Order[] = this.vendor ? this.dataService.getOrdersByVendor(this.vendor.id) : [];
  displayedColumns = ['orderId', 'customer', 'items', 'total', 'status', 'date', 'actions'];

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'primary';
      case 'shipped': return 'accent';
      case 'processing': return 'accent';
      case 'pending': return 'warn';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }
}
