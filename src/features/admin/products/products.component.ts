import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../core/services/data.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="products-page">
      <div class="page-header"><h1>Product Management</h1></div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="products" class="products-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product"><img [src]="product.images[0]?.url" [alt]="product.name"></td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{product.name}}</td>
            </ng-container>
            <ng-container matColumnDef="vendor">
              <th mat-header-cell *matHeaderCellDef>Vendor</th>
              <td mat-cell *matCellDef="let product">{{getVendorName(product.vendorId)}}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{getCategoryName(product.categoryId)}}</td>
            </ng-container>
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">{{product.variants[0]?.price | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip [color]="getStatusColor(product.status)">{{product.status}}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button color="primary" (click)="approve(product)"><mat-icon>check_circle</mat-icon></button>
                <button mat-icon-button color="warn" (click)="reject(product)"><mat-icon>cancel</mat-icon></button>
                <button mat-icon-button><mat-icon>visibility</mat-icon></button>
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
    .products-page { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .products-table { width: 100%; }
    th, td { padding: 12px; }
    .products-table img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; }
    mat-chip { font-size: 12px; min-height: 24px; text-transform: capitalize; }
  `]
})
export class AdminProductsComponent {
  dataService = inject(DataService);
  snackBar = inject(MatSnackBar);
  products: Product[] = this.dataService.getProducts();
  displayedColumns = ['image', 'name', 'vendor', 'category', 'price', 'status', 'actions'];

  getVendorName(id: string) { return this.dataService.getVendorById(id)?.storeName || ''; }
  getCategoryName(id: string) { return this.dataService.getCategoryById(id)?.name || ''; }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'primary';
      case 'pending': return 'accent';
      case 'rejected': return 'warn';
      default: return '';
    }
  }

  approve(product: Product): void { this.snackBar.open('Product approved!', 'Close', { duration: 2000 }); }
  reject(product: Product): void { this.snackBar.open('Product rejected!', 'Close', { duration: 2000 }); }
}
