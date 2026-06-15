import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService, Category, Product } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="products-page fade-in">
      <div class="page-header">
        <h1>My Products</h1>
        <button mat-raised-button color="primary" (click)="openAddModal()">
          <mat-icon>add</mat-icon> Add Product
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="products()" class="products-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product">
                <img [src]="product.images?.[0]?.url || 'assets/images/placeholder.png'" 
                     [alt]="product.name"
                     (error)="$any($event.target).src='https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=150'">
              </td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{product.name}}</td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{product.categoryName || getCategoryName(product.categoryId)}}</td>
            </ng-container>
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">{{(product.variants?.[0]?.price ?? 0) | currency:'INR'}}</td>
            </ng-container>
            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let product">
                {{product.variants?.[0]?.stockQuantity ?? product.variants?.[0]?.stock ?? 0}}
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Visibility</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip [color]="getStatusColor(product.status)">
                  {{getVisibilityLabel(product.status)}}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openEditModal(product)">
                    <mat-icon color="primary">edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  @if (product.status === 'DRAFT') {
                    <button mat-menu-item (click)="toggleVisibility(product)">
                      <mat-icon color="accent">public</mat-icon>
                      <span>Make Public</span>
                    </button>
                  } @else {
                    <button mat-menu-item (click)="toggleVisibility(product)">
                      <mat-icon>lock</mat-icon>
                      <span>Make Private</span>
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
        </mat-card-content>
      </mat-card>

      <!-- Add/Edit Product Modal -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h2>
              <button mat-icon-button (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveProduct()">
              <div class="modal-body">
                <div class="form-group">
                  <label for="prodName">Product Name *</label>
                  <input type="text" id="prodName" name="name" class="form-control"
                         [(ngModel)]="formName" required placeholder="e.g. iPhone 15 Pro Max">
                </div>

                <div class="form-group">
                  <label for="prodCategory">Category *</label>
                  <select id="prodCategory" name="categoryId" class="form-control" [(ngModel)]="formCategoryId" required>
                    <option *ngFor="let cat of categories()" [value]="cat.id">{{cat.name}}</option>
                  </select>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="prodPrice">Price (INR) *</label>
                    <input type="number" id="prodPrice" name="price" class="form-control"
                           [(ngModel)]="formPrice" required min="1" placeholder="e.g. 79999">
                  </div>

                  <div class="form-group">
                    <label for="prodStock">Stock Quantity *</label>
                    <input type="number" id="prodStock" name="stock" class="form-control"
                           [(ngModel)]="formStock" required min="0" placeholder="e.g. 50">
                  </div>
                </div>

                <div class="form-group">
                  <label for="prodImageUrl">Image URL</label>
                  <input type="text" id="prodImageUrl" name="imageUrl" class="form-control"
                         [(ngModel)]="formImageUrl" placeholder="e.g. https://example.com/image.jpg">
                </div>

                <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: center; margin-bottom: 8px;">
                  <div class="form-group" style="margin: 0;">
                    <label class="checkbox-label">
                      <input type="checkbox" name="isPublic" [(ngModel)]="formIsPublic">
                      <span>Public</span>
                    </label>
                  </div>
                  <div class="form-group" style="margin: 0;">
                    <label class="checkbox-label">
                      <input type="checkbox" name="isFeatured" [(ngModel)]="formIsFeatured">
                      <span>Featured</span>
                    </label>
                  </div>
                  <div class="form-group" style="margin: 0;">
                    <label class="checkbox-label">
                      <input type="checkbox" name="isTrending" [(ngModel)]="formIsTrending">
                      <span>Trending</span>
                    </label>
                  </div>
                </div>
                <small class="form-hint" style="margin-top: -8px; margin-bottom: 8px; display: block;">Public products are sent for admin review before going live. Private products stay hidden.</small>


                <div class="form-group">
                  <label for="prodShortDesc">Short Description</label>
                  <input type="text" id="prodShortDesc" name="shortDescription" class="form-control"
                         [(ngModel)]="formShortDescription" placeholder="Brief summary of the product">
                </div>

                <div class="form-group">
                  <label for="prodFullDesc">Full Description</label>
                  <textarea id="prodFullDesc" name="fullDescription" class="form-control" rows="3"
                            [(ngModel)]="formFullDescription" placeholder="Detailed product specifications or overview"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" mat-button (click)="closeModal()">Cancel</button>
                <button type="submit" mat-raised-button color="primary">{{ isEditMode() ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .products-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; margin: 0; color: var(--text-primary); }
    .products-table { width: 100%; background: transparent; }
    th, td { padding: 12px; }
    .products-table img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color); }
    mat-chip { font-size: 12px; min-height: 24px; text-transform: capitalize; }
    .actions-cell { display: flex; gap: 4px; }

    /* Modal Styling */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: var(--bg-secondary);
      color: var(--text-primary);
      width: 550px;
      max-width: 90%;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .modal-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      color: var(--text-primary);
    }
    .modal-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 13px;
    }
    .form-control {
      background: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s, outline 0.2s;
    }
    .form-control:focus {
      outline: 2px solid var(--primary);
      border-color: var(--primary);
    }
    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }
    .checkbox-label input {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
    }
    .form-hint {
      display: block;
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    @keyframes modalSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class VendorProductsComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);

  products = signal<any[]>([]);
  categories = signal<Category[]>([]);
  displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'status', 'actions'];

  // Modal Control
  showModal = signal(false);
  isEditMode = signal(false);
  editingProductId = signal<number | null>(null);

  // Form Fields
  formName = '';
  formCategoryId = 0;
  formPrice = 0;
  formStock = 0;
  formImageUrl = '';
  formShortDescription = '';
  formFullDescription = '';
  formIsPublic = true;
  formIsFeatured = false;
  formIsTrending = false;

  ngOnInit(): void {
    this.loadProducts();
    this.apiData.getCategories().subscribe(data => {
      this.categories.set(data);
      if (data.length > 0 && !this.formCategoryId) {
        this.formCategoryId = data[0].id;
      }
    });
  }

  loadProducts(): void {
    this.apiData.getVendorProducts().subscribe(data => this.products.set(data));
  }

  getCategoryName(id: number): string {
    return this.categories().find(c => c.id === id)?.name || '';
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'primary';
      case 'pending': return 'accent';
      case 'rejected': return 'warn';
      case 'draft': return '';
      default: return '';
    }
  }

  getVisibilityLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'Public (Approved)';
      case 'pending': return 'Public (Pending)';
      case 'rejected': return 'Public (Rejected)';
      case 'draft': return 'Private';
      default: return status || '';
    }
  }

  toggleVisibility(product: any): void {
    const newStatus = product.status === 'DRAFT' ? 'PENDING' : 'DRAFT';
    const payload = {
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      vendorId: product.vendorId || 0,
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      status: newStatus,
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      tags: [],
      specifications: {},
      variants: product.variants?.map((v: any) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        stockQuantity: v.stockQuantity ?? v.stock ?? 0,
        attributes: v.attributes || {}
      })) || [],
      images: product.images?.map((img: any) => ({
        url: img.url,
        altText: img.altText || img.alt || '',
        isPrimary: img.isPrimary || false
      })) || []
    };

    this.apiData.updateProduct(product.id, payload).subscribe({
      next: () => {
        const label = newStatus === 'DRAFT' ? 'private' : 'public (pending review)';
        this.snackBar.open(`Product is now ${label}!`, 'Close', { duration: 3000 });
        this.loadProducts();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to update visibility', 'Close', { duration: 3000 });
      }
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingProductId.set(null);
    this.formName = '';
    this.formCategoryId = this.categories().length > 0 ? this.categories()[0].id : 0;
    this.formPrice = 0;
    this.formStock = 0;
    this.formImageUrl = '';
    this.formShortDescription = '';
    this.formFullDescription = '';
    this.formIsPublic = true;
    this.formIsFeatured = false;
    this.formIsTrending = false;
    this.showModal.set(true);
  }

  openEditModal(product: any): void {
    this.isEditMode.set(true);
    this.editingProductId.set(product.id);
    this.formName = product.name;
    this.formCategoryId = product.categoryId;
    
    const variant = product.variants?.[0];
    this.formPrice = variant ? (variant.price as any) : 0;
    this.formStock = variant ? ((variant as any).stockQuantity ?? (variant as any).stock ?? 0) : 0;
    
    this.formImageUrl = product.images?.[0]?.url ?? '';
    this.formShortDescription = product.shortDescription || '';
    this.formFullDescription = product.description || product.fullDescription || '';
    this.formIsPublic = product.status !== 'DRAFT';
    this.formIsFeatured = product.isFeatured || false;
    this.formIsTrending = product.isTrending || false;
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveProduct(): void {
    if (!this.formName || !this.formCategoryId || this.formPrice <= 0 || this.formStock < 0) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const slug = this.formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name: this.formName,
      slug: slug,
      categoryId: this.formCategoryId,
      vendorId: 0, // Backend sets vendorId from authenticated session, but requires non-null value
      shortDescription: this.formShortDescription,
      fullDescription: this.formFullDescription || this.formShortDescription,
      status: this.formIsPublic ? 'PENDING' : 'DRAFT',
      isFeatured: this.formIsFeatured,
      isTrending: this.formIsTrending,
      tags: [],
      specifications: {},
      variants: [
        {
          name: 'Default',
          sku: 'SKU-' + this.formName.substring(0, 3).toUpperCase() + '-' + Date.now(),
          price: this.formPrice,
          stockQuantity: this.formStock,
          attributes: {}
        }
      ],
      images: this.formImageUrl ? [
        {
          url: this.formImageUrl,
          altText: this.formName,
          isPrimary: true
        }
      ] : []
    };

    if (this.isEditMode()) {
      this.apiData.updateProduct(this.editingProductId()!, payload).subscribe({
        next: () => {
          const msg = this.formIsPublic
            ? 'Product updated successfully, pending approval!'
            : 'Product updated successfully (private)!';
          this.snackBar.open(msg, 'Close', { duration: 3000 });
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to update product', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.apiData.createProduct(payload).subscribe({
        next: () => {
          const msg = this.formIsPublic
            ? 'Product created successfully, pending approval!'
            : 'Product created successfully (private)!';
          this.snackBar.open(msg, 'Close', { duration: 3000 });
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to create product', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiData.deleteProduct(productId).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to delete product', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
