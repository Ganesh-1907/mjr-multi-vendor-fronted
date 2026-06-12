import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="products-page">
      <div class="page-header">
        <h1>My Products</h1>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> Add Product</button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="products" class="products-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product">
                <img [src]="product.images[0]?.url" [alt]="product.name">
              </td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{product.name}}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{getCategoryName(product.categoryId)}}</td>
            </ng-container>
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">{{product.variants[0]?.price | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let product">{{product.variants[0]?.stock}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip [color]="product.status === 'approved' ? 'primary' : product.status === 'pending' ? 'accent' : 'warn'">
                  {{product.status}}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
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
    .products-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .products-table { width: 100%; }
    .products-table img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; }
    th, td { padding: 12px; }
    mat-chip { text-transform: capitalize; font-size: 12px; min-height: 24px; }
  `]
})
export class VendorProductsComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);
  snackBar = inject(MatSnackBar);

  vendor = this.dataService.getVendorById(this.auth.currentUser()?.id || '');
  products: Product[] = this.vendor ? this.dataService.getProductsByVendor(this.vendor.id) : [];
  displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'status', 'actions'];

  getCategoryName(id: string): string {
    return this.dataService.getCategoryById(id)?.name || '';
  }
}
