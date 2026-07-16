import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ApiDataService, Product, Vendor, Category } from '../../../core/services/api-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule, MatSelectModule],
  template: `
    <div class="products-page fade-in">
      <div class="page-header">
        <h1>Product Management</h1>
      </div>

      <mat-card class="filters-card">
        <mat-card-content class="filters-row">
          <mat-form-field appearance="outline" class="filter-select">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="filterCategory">
              <mat-option value="">All Categories</mat-option>
              @for (cat of categories(); track cat.id) {
                <mat-option [value]="cat.id">{{cat.name}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-select">
            <mat-label>Vendor</mat-label>
            <mat-select [(ngModel)]="filterVendor">
              <mat-option value="">All Vendors</mat-option>
              @for (vendor of vendors(); track vendor.id) {
                <mat-option [value]="vendor.id">{{vendor.storeName}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-select">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filterStatus">
              <mat-option value="">All Statuses</mat-option>
              @for (status of env.productStatuses; track status) {
                <mat-option [value]="status">{{status}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <div class="filter-actions">
            <button mat-raised-button color="primary" (click)="applyFilters()">Apply</button>
            <button mat-stroked-button (click)="clearFilters()">Clear All</button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="filteredProducts()" class="products-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product">
                <img [src]="product.images?.[0]?.url || env.placeholderImage" 
                     [alt]="product.name" 
                     (error)="$any($event.target).src=env.placeholderImage">
              </td>
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
              <td mat-cell *matCellDef="let product">{{(product.variants?.[0]?.price ?? 0) | currency:env.currencyCode}}</td>
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
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  @if (product.status !== 'APPROVED') {
                    <button mat-menu-item (click)="approve(product)">
                      <mat-icon color="accent">check_circle</mat-icon>
                      <span>Approve</span>
                    </button>
                  }
                  @if (product.status !== 'REJECTED') {
                    <button mat-menu-item (click)="reject(product)">
                      <mat-icon color="warn">cancel</mat-icon>
                      <span>Reject</span>
                    </button>
                  }
                  <button mat-menu-item (click)="deleteProduct(product.id)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          @if (filteredProducts().length === 0) {
            <div class="no-records">No products found matching the filters.</div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .products-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h1 { font-size: 28px; margin: 0; color: var(--text-primary); }
    
    .filters-card { margin-bottom: 20px; }
    .filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 16px !important; }
    .filter-select { min-width: 180px; }
    .filter-actions { display: flex; gap: 8px; margin-left: auto; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    
    .products-table { width: 100%; background: transparent; }
    th, td { padding: 12px; }
    .products-table img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color); }
    mat-chip { font-size: 12px; min-height: 24px; text-transform: capitalize; }
    .no-records { padding: 32px; text-align: center; color: #757575; font-style: italic; }
    @media (max-width: 768px) {
      .filters-row { flex-direction: column; align-items: stretch; }
      .filter-select { width: 100%; min-width: unset; }
      .filter-actions { margin-left: 0; width: 100%; justify-content: space-between; }
      .filter-actions button { flex: 1; }
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  apiDataService = inject(ApiDataService);
  snackBar = inject(MatSnackBar);
  env = environment;

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  vendors = signal<Vendor[]>([]);
  categories = signal<Category[]>([]);
  displayedColumns = ['image', 'name', 'vendor', 'category', 'price', 'status', 'actions'];

  filterCategory = '';
  filterVendor = '';
  filterStatus = '';

  ngOnInit(): void {
    this.loadProducts();
    this.apiDataService.getAdminVendors().subscribe(data => this.vendors.set(data));
    this.apiDataService.getCategories().subscribe(data => this.categories.set(data));
  }

  loadProducts(): void {
    this.apiDataService.getAdminProducts().subscribe(data => {
      this.products.set(data);
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let result = this.products();
    if (this.filterCategory) {
      result = result.filter(p => p.categoryId === Number(this.filterCategory));
    }
    if (this.filterVendor) {
      result = result.filter(p => p.vendorId === Number(this.filterVendor));
    }
    if (this.filterStatus) {
      result = result.filter(p => p.status === this.filterStatus);
    }
    this.filteredProducts.set(result);
  }

  clearFilters(): void {
    this.filterCategory = '';
    this.filterVendor = '';
    this.filterStatus = '';
    this.filteredProducts.set(this.products());
  }

  getVendorName(id: number): string {
    return this.vendors().find(v => v.id === id)?.storeName || '';
  }

  getCategoryName(id: number): string {
    return this.categories().find(c => c.id === id)?.name || '';
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'primary';
      case 'pending': return 'accent';
      case 'rejected': return 'warn';
      default: return '';
    }
  }

  approve(product: Product): void {
    this.apiDataService.approveProduct(product.id).subscribe(() => {
      this.snackBar.open('Product approved!', 'Close', { duration: 2000 });
      this.loadProducts();
    });
  }

  reject(product: Product): void {
    this.apiDataService.rejectProduct(product.id).subscribe(() => {
      this.snackBar.open('Product rejected!', 'Close', { duration: 2000 });
      this.loadProducts();
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiDataService.deleteAdminProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully!', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to delete product', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
