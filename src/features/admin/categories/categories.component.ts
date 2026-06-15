import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { ApiDataService, Category } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatMenuModule],
  template: `
    <div class="categories-page fade-in">
      <div class="page-header">
        <h1>Category Management</h1>
        <button mat-raised-button color="primary" (click)="openAddModal()">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="categories()" class="categories-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let cat">
                <img [src]="cat.imageUrl || 'assets/images/placeholder.svg'" [alt]="cat.name" class="cat-thumb" (error)="onThumbError($event)">
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Category Name</th>
              <td mat-cell *matCellDef="let cat">
                <div class="name-cell">
                  <span>{{cat.name}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Products Count</th>
              <td mat-cell *matCellDef="let cat">{{cat.productCount ?? 0}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let cat">
                <span class="status-badge" [ngClass]="cat.isActive ? 'active' : 'inactive'">
                  {{cat.isActive ? 'Active' : 'Inactive'}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let cat">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openEditModal(cat)">
                    <mat-icon color="primary">edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteCategory(cat.id)">
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

      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isEditMode() ? 'Edit Category' : 'Add New Category' }}</h2>
              <button mat-icon-button (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveCategory()">
              <div class="modal-body">
                <div class="form-group">
                  <label for="catName">Category Name *</label>
                  <input type="text" id="catName" name="name" class="form-control"
                         [(ngModel)]="formName" required placeholder="e.g. Electronics">
                </div>

                <div class="form-group">
                  <label for="catImageUrl">Image URL</label>
                  <input type="text" id="catImageUrl" name="imageUrl" class="form-control"
                         [(ngModel)]="formImageUrl" placeholder="https://example.com/image.jpg">
                  @if (formImageUrl()) {
                    <div class="image-preview">
                      <img [src]="formImageUrl()" alt="Preview" (error)="onPreviewError($event)">
                      <button type="button" class="remove-img-btn" (click)="formImageUrl.set('')">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  }
                </div>


                <div class="form-group">
                  <label for="catDesc">Description</label>
                  <textarea id="catDesc" name="description" class="form-control textarea"
                            [(ngModel)]="formDescription" rows="3" placeholder="Brief description..."></textarea>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isActive" [(ngModel)]="formIsActive">
                    Active Category
                  </label>
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
    .categories-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { font-size: 28px; margin: 0; color: var(--text-primary); }
    .categories-table { width: 100%; background: transparent; }
    th, td { padding: 12px; }
    .cat-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; background: var(--bg-tertiary); }
    .name-cell { display: flex; align-items: center; gap: 8px; color: var(--text-primary); }
    .name-cell mat-icon { color: var(--primary); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
    .status-badge.active { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-badge.inactive { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }

    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
      background: var(--bg-secondary); color: var(--text-primary);
      width: 500px; max-width: 90%; border-radius: var(--radius-lg);
      border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);
      overflow: hidden; display: flex; flex-direction: column;
      animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .modal-header {
      padding: 16px 24px; border-bottom: 1px solid var(--border-color);
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-header h2 { margin: 0; font-size: 20px; color: var(--text-primary); }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; max-height: 70vh; overflow-y: auto; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-weight: 600; color: var(--text-secondary); font-size: 13px; }
    .form-control {
      background: var(--bg-primary); color: var(--text-primary);
      border: 1px solid var(--border-color); padding: 10px 12px;
      border-radius: var(--radius-sm); font-family: inherit; font-size: 14px;
      transition: border-color 0.2s, outline 0.2s;
    }
    .form-control:focus { outline: 2px solid var(--primary); border-color: var(--primary); }
    .textarea { resize: vertical; }
    .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .checkbox-group input { width: 16px; height: 16px; accent-color: var(--primary); }
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid var(--border-color);
      display: flex; justify-content: flex-end; gap: 12px; background: var(--bg-tertiary);
    }

    .image-preview {
      position: relative; width: 100%; height: 160px; border-radius: var(--radius-md);
      overflow: hidden; background: var(--bg-tertiary); border: 1px solid var(--border-color);
      margin-top: 8px;
    }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    .remove-img-btn {
      position: absolute; top: 8px; right: 8px;
      background: rgba(0,0,0,0.6); color: white; border: none;
      border-radius: 50%; width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      transition: background 0.2s;
    }
    .remove-img-btn:hover { background: rgba(220, 38, 38, 0.8); }
    .remove-img-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }

    @keyframes modalSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private apiDataService = inject(ApiDataService);
  categories = signal<Category[]>([]);
  displayedColumns = ['image', 'name', 'products', 'status', 'actions'];

  showModal = signal(false);
  isEditMode = signal(false);
  selectedCategoryId = signal<number | null>(null);

  formName = signal('');
  formImageUrl = signal('');
  formDescription = signal('');
  formIsActive = signal(true);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiDataService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedCategoryId.set(null);
    this.formName.set('');
    this.formImageUrl.set('');
    this.formDescription.set('');
    this.formIsActive.set(true);
    this.showModal.set(true);
  }

  openEditModal(cat: Category): void {
    this.isEditMode.set(true);
    this.selectedCategoryId.set(cat.id);
    this.formName.set(cat.name);
    this.formImageUrl.set(cat.imageUrl || '');
    this.formDescription.set(cat.description || '');
    this.formIsActive.set(cat.isActive);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveCategory(): void {
    const payload: any = {
      name: this.formName(),
      imageUrl: this.formImageUrl(),
      description: this.formDescription(),
      isActive: this.formIsActive()
    };

    if (this.isEditMode()) {
      const id = this.selectedCategoryId();
      if (id !== null) {
        this.apiDataService.updateCategory(id, payload).subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal();
          },
          error: (err) => alert(err.error?.message || 'Failed to update category')
        });
      }
    } else {
      this.apiDataService.createCategory(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to create category')
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiDataService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Failed to delete category')
      });
    }
  }

  onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.svg';
  }

  onPreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.style.display = 'none';
    }
  }
}
