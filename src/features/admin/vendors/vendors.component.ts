import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../core/services/data.service';
import { Vendor } from '../../../core/models';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="vendors-page">
      <div class="page-header"><h1>Vendor Management</h1></div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="vendors" class="vendors-table">
            <ng-container matColumnDef="store">
              <th mat-header-cell *matHeaderCellDef>Store</th>
              <td mat-cell *matCellDef="let vendor">
                <div class="store-info">
                  <img [src]="vendor.storeLogo" [alt]="vendor.storeName">
                  <div><span class="store-name">{{vendor.storeName}}</span><span class="owner">({{vendor.firstName}} {{vendor.lastName}})</span></div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.email}}</td>
            </ng-container>
            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef>Rating</th>
              <td mat-cell *matCellDef="let vendor">
                <span class="rating"><mat-icon>star</mat-icon> {{vendor.rating | number:'1.1-1'}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Products</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.totalProducts}}</td>
            </ng-container>
            <ng-container matColumnDef="sales">
              <th mat-header-cell *matHeaderCellDef>Sales</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.totalSales | number}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let vendor">
                <mat-chip [color]="vendor.isVerified ? 'primary' : 'warn'">{{vendor.isVerified ? 'Verified' : 'Pending'}}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let vendor">
                <button mat-icon-button><mat-icon>visibility</mat-icon></button>
                <button mat-icon-button color="primary"><mat-icon>check_circle</mat-icon></button>
                <button mat-icon-button color="warn"><mat-icon>block</mat-icon></button>
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
    .vendors-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .vendors-table { width: 100%; }
    th, td { padding: 12px; }
    .store-info { display: flex; align-items: center; gap: 12px; }
    .store-info img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
    .store-name { font-weight: 500; display: block; }
    .owner { font-size: 12px; color: #757575; }
    .rating { display: flex; align-items: center; gap: 4px; }
    .rating mat-icon { font-size: 16px; color: #f57c00; }
    mat-chip { font-size: 12px; min-height: 24px; }
  `]
})
export class AdminVendorsComponent {
  dataService = inject(DataService);
  vendors: Vendor[] = this.dataService.getVendors();
  displayedColumns = ['store', 'email', 'rating', 'products', 'sales', 'status', 'actions'];
}
