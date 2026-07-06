import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiDataService } from '../../../core/services/api-data.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="vendors-page">
      <div class="page-header"><h1>Vendor Management</h1></div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="vendors()" class="vendors-table">
            <ng-container matColumnDef="store">
              <th mat-header-cell *matHeaderCellDef>Store</th>
              <td mat-cell *matCellDef="let vendor">
                <div class="store-info">
                  <div><span class="store-name">{{vendor.storeName}}</span><span class="owner" *ngIf="vendor.user">({{vendor.user?.firstName}} {{vendor.user?.lastName}})</span></div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.user?.email || vendor.businessEmail}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let vendor">
                <mat-chip-set>
                  <mat-chip *ngIf="vendor.user && !vendor.user.isActive" style="background: #ffebee; color: #f44336;">Blocked</mat-chip>
                  <mat-chip *ngIf="(vendor.user?.isActive ?? true) && !vendor.isVerified" style="background: #fff8e1; color: #ffb300;">Pending</mat-chip>
                  <mat-chip *ngIf="(vendor.user?.isActive ?? true) && vendor.isVerified" style="background: #e8f5e9; color: #4caf50;">Active</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>
            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Products</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.totalProducts || 0}}</td>
            </ng-container>
            <ng-container matColumnDef="sales">
              <th mat-header-cell *matHeaderCellDef>Sales</th>
              <td mat-cell *matCellDef="let vendor">{{vendor.totalSales || 0 | number}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let vendor">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="viewVendor(vendor.id)">
                    <mat-icon>visibility</mat-icon>
                    <span>View Details</span>
                  </button>

                  <button mat-menu-item (click)="rejectVendor(vendor.id)" *ngIf="vendor.user?.isActive">
                    <mat-icon color="warn">block</mat-icon>
                    <span>Reject / Block Vendor</span>
                  </button>

                  <button mat-menu-item (click)="unblockVendor(vendor.user._id)" *ngIf="vendor.user && !vendor.user.isActive">
                    <mat-icon color="primary">restore</mat-icon>
                    <span>Unblock Vendor</span>
                  </button>

                  <button mat-menu-item (click)="approveVendor(vendor.id)" *ngIf="!vendor.isVerified && vendor.user?.isActive">
                    <mat-icon color="primary">check_circle</mat-icon>
                    <span>Approve Vendor</span>
                  </button>
                </mat-menu>
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
    .store-name { font-weight: 500; display: block; }
    .owner { font-size: 12px; color: #757575; }
    .rating { display: flex; align-items: center; gap: 4px; }
    .rating mat-icon { font-size: 16px; color: #f57c00; }
    mat-chip { font-size: 12px; min-height: 24px; }
  `]
})
export class AdminVendorsComponent implements OnInit {
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  private dialog = inject(MatDialog);

  vendors = signal<any[]>([]);
  displayedColumns = ['store', 'email', 'status', 'products', 'sales', 'actions'];

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.apiData.getAdminVendors().subscribe(data => this.vendors.set(data));
  }

  approveVendor(vendorId: number): void {
    this.apiData.approveVendor(vendorId).subscribe(() => {
      this.snackBar.open('Vendor approved successfully', 'Close', { duration: 3000 });
      this.loadVendors();
    });
  }

  rejectVendor(vendorId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      data: {
        title: 'Reject / Block Vendor',
        message: 'Are you sure you want to reject or block this vendor? Please enter a reason below:',
        isPrompt: true,
        promptPlaceholder: 'Reason for rejection',
        okText: 'Reject / Block',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.apiData.rejectVendor(vendorId, reason).subscribe(() => {
          this.snackBar.open('Vendor rejected', 'Close', { duration: 3000 });
          this.loadVendors();
        });
      }
    });
  }

  unblockVendor(userId: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Unblock Vendor',
        message: 'Are you sure you want to unblock this vendor?',
        okText: 'Unblock',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.apiData.updateUserStatus(userId, true).subscribe(() => {
          this.snackBar.open('Vendor unblocked successfully', 'Close', { duration: 3000 });
          this.loadVendors();
        });
      }
    });
  }

  viewVendor(vendorId: string): void {
    this.router.navigate(['/admin/vendors', vendorId]);
  }
}
