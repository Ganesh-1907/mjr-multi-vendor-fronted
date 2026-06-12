import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../../core/services/data.service';
import { Coupon } from '../../../core/models';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="coupons-page">
      <div class="page-header">
        <h1>Coupon Management</h1>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> Create Coupon</button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="coupons" class="coupons-table">
            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Code</th>
              <td mat-cell *matCellDef="let coupon"><span class="code">{{coupon.code}}</span></td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let coupon">{{coupon.type === 'percentage' ? coupon.value + '%' : 'INR ' + coupon.value}}</td>
            </ng-container>
            <ng-container matColumnDef="minOrder">
              <th mat-header-cell *matHeaderCellDef>Min Order</th>
              <td mat-cell *matCellDef="let coupon">{{coupon.minOrderAmount | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="usage">
              <th mat-header-cell *matHeaderCellDef>Usage</th>
              <td mat-cell *matCellDef="let coupon">{{coupon.usedCount}} / {{coupon.usageLimit}}</td>
            </ng-container>
            <ng-container matColumnDef="validity">
              <th mat-header-cell *matHeaderCellDef>Valid Until</th>
              <td mat-cell *matCellDef="let coupon">{{coupon.validUntil | date:'shortDate'}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let coupon">
                <mat-chip [color]="coupon.isActive ? 'primary' : 'warn'">{{coupon.isActive ? 'Active' : 'Inactive'}}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let coupon">
                <button mat-icon-button><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn"><mat-icon>delete</mat-icon></button>
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
    .coupons-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .coupons-table { width: 100%; }
    th, td { padding: 12px; }
    .code { font-family: monospace; font-weight: 600; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; }
    mat-chip { font-size: 12px; min-height: 24px; }
  `]
})
export class AdminCouponsComponent {
  dataService = inject(DataService);
  coupons: Coupon[] = this.dataService.getCoupons();
  displayedColumns = ['code', 'type', 'minOrder', 'usage', 'validity', 'status', 'actions'];
}
