import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../../core/services/api.service';
import { ApiDataService, Category } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="banners-page fade-in">
      <div class="page-header">
        <h1>Banner Management</h1>
        <button mat-raised-button color="primary" (click)="openAddModal()">
          <mat-icon>add</mat-icon> Create Banner
        </button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="banners()" class="banners-table">
            <ng-container matColumnDef="preview">
              <th mat-header-cell *matHeaderCellDef>Preview</th>
              <td mat-cell *matCellDef="let banner">
                <img [src]="banner.imageUrl" [alt]="banner.title">
              </td>
            </ng-container>
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let banner">
                <div class="title-cell">
                  <span class="main-title">{{banner.title}}</span>
                  <span class="subtitle">{{banner.subtitle}}</span>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>Position</th>
              <td mat-cell *matCellDef="let banner">
                <span class="position-badge">{{banner.position}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="link">
              <th mat-header-cell *matHeaderCellDef>Link</th>
              <td mat-cell *matCellDef="let banner"><span class="link-text">{{banner.linkUrl}}</span></td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let banner">
                <span class="status-badge" [ngClass]="banner.isActive ? 'active' : 'inactive'">
                  {{banner.isActive ? 'Active' : 'Inactive'}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let banner">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="toggleStatus(banner)">
                    <mat-icon>{{banner.isActive ? 'block' : 'check_circle'}}</mat-icon>
                    <span>{{banner.isActive ? 'Deactivate' : 'Activate'}}</span>
                  </button>
                  <button mat-menu-item (click)="openEditModal(banner)">
                    <mat-icon color="primary">edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteBanner(banner.id)">
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
              <h2>{{ isEditMode() ? 'Edit Banner' : 'Create New Banner' }}</h2>
              <button mat-icon-button (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveBanner()">
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="bannerTitle">Banner Title *</label>
                    <input type="text" id="bannerTitle" name="title" class="form-control"
                           [(ngModel)]="formTitle" required placeholder="e.g. Mega Sale Week">
                  </div>
                  <div class="form-group half-width">
                    <label for="bannerSubtitle">Subtitle</label>
                    <input type="text" id="bannerSubtitle" name="subtitle" class="form-control"
                           [(ngModel)]="formSubtitle" placeholder="e.g. Up to 70% off">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group full-width">
                    <label for="imageUrl">Image URL *</label>
                    <input type="text" id="imageUrl" name="imageUrl" class="form-control"
                           [(ngModel)]="formImageUrl" required placeholder="https://example.com/image.jpg">
                    @if (formImageUrl()) {
                      <div class="image-preview">
                        <img [src]="formImageUrl()" alt="Preview" #previewImg (error)="previewImg.style.display='none'">
                      </div>
                    }
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="linkOption">Link Destination *</label>
                    <select id="linkOption" name="linkOption" class="form-control" 
                            [ngModel]="selectedLinkOption()" (ngModelChange)="onLinkOptionChange($event)" required>
                      <option value="">No Link</option>
                      <option value="/products">All Products</option>
                      <option value="/offers">Offers / Coupons</option>
                      @for (cat of categories(); track cat.id) {
                        <option [value]="'/products?category=' + cat.slug">Category: {{cat.name}}</option>
                      }
                      <option value="custom">-- Custom Path / URL --</option>
                    </select>
                  </div>
                  <div class="form-group half-width">
                    <label for="buttonText">Button Text</label>
                    <input type="text" id="buttonText" name="buttonText" class="form-control"
                           [(ngModel)]="formButtonText" placeholder="e.g. Shop Now">
                  </div>
                </div>

                @if (selectedLinkOption() === 'custom') {
                  <div class="form-row">
                    <div class="form-group full-width">
                      <label for="linkUrl">Custom Link URL *</label>
                      <input type="text" id="linkUrl" name="linkUrl" class="form-control"
                             [(ngModel)]="formLinkUrl" required placeholder="e.g. /products?featured=true">
                    </div>
                  </div>
                }

                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="position">Position *</label>
                    <select id="position" name="position" class="form-control" [(ngModel)]="formPosition" required>
                      <option value="HOME_HERO">Home Hero Carousel</option>
                      <option value="HOME_PROMO">Home Promo Banner</option>
                    </select>
                    <div class="form-help-text">
                      @if (formPosition() === 'HOME_HERO') {
                        <span>Displays in the large sliding carousel at the top of the Home page.</span>
                      } @else {
                        <span>Displays in the promotional grid banners lower down on the Home page.</span>
                      }
                    </div>
                  </div>
                  <div class="form-group half-width">
                    <label for="displayOrder">Display Order</label>
                    <input type="number" id="displayOrder" name="displayOrder" class="form-control"
                           [(ngModel)]="formDisplayOrder" min="0" placeholder="e.g. 1">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="startDate">Start Date</label>
                    <input type="datetime-local" id="startDate" name="startDate" class="form-control"
                           [(ngModel)]="formStartDate">
                  </div>
                  <div class="form-group half-width">
                    <label for="endDate">End Date</label>
                    <input type="datetime-local" id="endDate" name="endDate" class="form-control"
                           [(ngModel)]="formEndDate">
                  </div>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isActive" [(ngModel)]="formIsActive">
                    Active Banner
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
    .banners-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .banners-table { width: 100%; background: transparent; }
    th, td { padding: 12px; }
    .banners-table img { width: 120px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); }
    .title-cell { display: flex; flex-direction: column; }
    .main-title { font-weight: 600; color: var(--text-primary); }
    .subtitle { font-size: 12px; color: var(--text-secondary); }
    .position-badge { background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; font-weight: 600; color: var(--primary); }
    .link-text { font-family: monospace; font-size: 12px; color: var(--text-secondary); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
    .status-badge.active { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-badge.inactive { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
    
    .image-preview { margin-top: 8px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); padding: 4px; display: flex; justify-content: center; background: var(--bg-tertiary); }
    .image-preview img { max-width: 100%; max-height: 120px; object-fit: contain; border-radius: 2px; }
    .form-help-text { font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.3; }

    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
      background: var(--bg-secondary); color: var(--text-primary);
      width: 550px; max-width: 90%; border-radius: var(--radius-lg);
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
    
    .form-row { display: flex; gap: 16px; width: 100%; }
    .half-width { flex: 1; }
    .full-width { width: 100%; }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-weight: 600; color: var(--text-secondary); font-size: 13px; }
    .form-control {
      background: var(--bg-primary); color: var(--text-primary);
      border: 1px solid var(--border-color); padding: 10px 12px;
      border-radius: var(--radius-sm); font-family: inherit; font-size: 14px;
      transition: border-color 0.2s, outline 0.2s;
    }
    .form-control:focus { outline: 2px solid var(--primary); border-color: var(--primary); }
    select.form-control { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 32px; }
    
    .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .checkbox-group input { width: 16px; height: 16px; accent-color: var(--primary); }
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid var(--border-color);
      display: flex; justify-content: flex-end; gap: 12px; background: var(--bg-tertiary);
    }
    @keyframes modalSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class AdminBannersComponent implements OnInit {
  apiService = inject(ApiService);
  apiDataService = inject(ApiDataService);
  
  banners = signal<any[]>([]);
  categories = signal<Category[]>([]);
  displayedColumns = ['preview', 'title', 'position', 'link', 'status', 'actions'];

  showModal = signal(false);
  isEditMode = signal(false);
  selectedBannerId = signal<number | null>(null);

  formTitle = signal('');
  formSubtitle = signal('');
  formImageUrl = signal('');
  formLinkUrl = signal('');
  formButtonText = signal('');
  formPosition = signal('HOME_HERO');
  formDisplayOrder = signal<number>(1);
  formIsActive = signal(true);
  formStartDate = signal('');
  formEndDate = signal('');
  
  selectedLinkOption = signal('');

  ngOnInit(): void {
    this.loadBanners();
    this.loadCategories();
  }

  loadBanners(): void {
    this.apiService.get<any[]>('/admin/banners').subscribe({
      next: (data) => this.banners.set(data),
      error: (err) => console.error('Failed to load banners', err)
    });
  }

  loadCategories(): void {
    this.apiDataService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedBannerId.set(null);
    this.formTitle.set('');
    this.formSubtitle.set('');
    this.formImageUrl.set('');
    this.formLinkUrl.set('');
    this.formButtonText.set('');
    this.formPosition.set('HOME_HERO');
    this.formDisplayOrder.set(1);
    this.formIsActive.set(true);
    this.formStartDate.set('');
    this.formEndDate.set('');
    this.selectedLinkOption.set('');
    this.showModal.set(true);
  }

  openEditModal(banner: any): void {
    this.isEditMode.set(true);
    this.selectedBannerId.set(banner.id);
    this.formTitle.set(banner.title || '');
    this.formSubtitle.set(banner.subtitle || '');
    this.formImageUrl.set(banner.imageUrl || '');
    this.formLinkUrl.set(banner.linkUrl || '');
    this.formButtonText.set(banner.buttonText || '');
    this.formPosition.set(banner.position || 'HOME_HERO');
    this.formDisplayOrder.set(banner.displayOrder || 1);
    this.formIsActive.set(banner.isActive !== false);
    this.formStartDate.set(this.formatDateForInput(banner.startDate));
    this.formEndDate.set(this.formatDateForInput(banner.endDate));

    // Determine selectedLinkOption based on linkUrl
    const link = banner.linkUrl || '';
    if (link === '' || link === '/products' || link === '/offers' || this.categories().some(cat => `/products?category=${cat.slug}` === link)) {
      this.selectedLinkOption.set(link);
    } else {
      this.selectedLinkOption.set('custom');
    }
    
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onLinkOptionChange(value: string): void {
    this.selectedLinkOption.set(value);
    if (value !== 'custom') {
      this.formLinkUrl.set(value);
    } else {
      this.formLinkUrl.set('');
    }
  }

  saveBanner(): void {
    if (!this.formTitle() || !this.formImageUrl()) {
      alert('Title and Image URL are required');
      return;
    }

    const payload = {
      title: this.formTitle(),
      subtitle: this.formSubtitle(),
      imageUrl: this.formImageUrl(),
      linkUrl: this.formLinkUrl(),
      buttonText: this.formButtonText(),
      position: this.formPosition(),
      displayOrder: this.formDisplayOrder(),
      isActive: this.formIsActive(),
      startDate: this.formatDateForBackend(this.formStartDate()),
      endDate: this.formatDateForBackend(this.formEndDate())
    };

    if (this.isEditMode()) {
      const id = this.selectedBannerId();
      this.apiService.putRaw<any>(`/admin/banners/${id}`, payload).subscribe({
        next: () => {
          this.loadBanners();
          this.closeModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to update banner')
      });
    } else {
      this.apiService.postRaw<any>('/admin/banners', payload).subscribe({
        next: () => {
          this.loadBanners();
          this.closeModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to create banner')
      });
    }
  }

  deleteBanner(id: number): void {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.apiService.deleteRaw<any>(`/admin/banners/${id}`).subscribe({
        next: () => this.loadBanners(),
        error: (err) => alert(err.error?.message || 'Failed to delete banner')
      });
    }
  }

  toggleStatus(banner: any): void {
    const payload = {
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      position: banner.position,
      displayOrder: banner.displayOrder,
      isActive: !banner.isActive,
      startDate: this.formatDateForBackend(banner.startDate),
      endDate: this.formatDateForBackend(banner.endDate)
    };

    this.apiService.putRaw<any>(`/admin/banners/${banner.id}`, payload).subscribe({
      next: () => this.loadBanners(),
      error: (err) => alert(err.error?.message || 'Failed to update banner status')
    });
  }

  formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      return dateString;
    }
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return '';
    }
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const d = new Date(dateString.replace(' ', 'T'));
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  }
}
