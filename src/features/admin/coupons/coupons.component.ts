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

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="coupons-page fade-in">
      <div class="page-header">
        <h1>Coupon Management</h1>
        <button mat-raised-button color="primary" (click)="openAddModal()">
          <mat-icon>add</mat-icon> Create Coupon
        </button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="coupons()" class="coupons-table">
            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Code</th>
              <td mat-cell *matCellDef="let coupon"><span class="code">{{coupon.code}}</span></td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let coupon">
                {{coupon.type === 'PERCENTAGE' ? coupon.value + '%' : 'INR ' + coupon.value}}
              </td>
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
                <span class="status-badge" [ngClass]="coupon.isActive ? 'active' : 'inactive'">
                  {{coupon.isActive ? 'Active' : 'Inactive'}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let coupon">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="toggleStatus(coupon)">
                    <mat-icon>{{coupon.isActive ? 'block' : 'check_circle'}}</mat-icon>
                    <span>{{coupon.isActive ? 'Deactivate' : 'Activate'}}</span>
                  </button>
                  <button mat-menu-item (click)="openEditModal(coupon)">
                    <mat-icon color="primary">edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteCoupon(coupon.id)">
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
              <h2>{{ isEditMode() ? 'Edit Coupon' : 'Create New Coupon' }}</h2>
              <button mat-icon-button (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveCoupon()">
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="couponCode">Coupon Code *</label>
                    <input type="text" id="couponCode" name="code" class="form-control"
                           [(ngModel)]="formCode" required placeholder="e.g. WELCOME10">
                  </div>
                  <div class="form-group half-width">
                    <label for="couponType">Coupon Type *</label>
                    <select id="couponType" name="type" class="form-control" [(ngModel)]="formType" required>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (INR)</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="couponValue">Discount Value *</label>
                    <input type="number" id="couponValue" name="value" class="form-control"
                           [(ngModel)]="formValue" required min="0" placeholder="e.g. 10 or 200">
                  </div>
                  <div class="form-group half-width">
                    <label for="minOrder">Min Order Amount (INR)</label>
                    <input type="number" id="minOrder" name="minOrderAmount" class="form-control"
                           [(ngModel)]="formMinOrderAmount" min="0" placeholder="e.g. 500">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group half-width">
                    <label for="maxDiscount">Max Discount (INR)</label>
                    <input type="number" id="maxDiscount" name="maxDiscountAmount" class="form-control"
                           [(ngModel)]="formMaxDiscountAmount" min="0" placeholder="e.g. 1000">
                  </div>
                  <div class="form-group half-width">
                    <label for="usageLimit">Total Usage Limit *</label>
                    <input type="number" id="usageLimit" name="usageLimit" class="form-control"
                           [(ngModel)]="formUsageLimit" required min="1" placeholder="e.g. 1000">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group full-width">
                    <label for="validUntil">Valid Until *</label>
                    <input type="datetime-local" id="validUntil" name="validUntil" class="form-control"
                           [(ngModel)]="formValidUntil" required>
                  </div>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isActive" [(ngModel)]="formIsActive">
                    Active Coupon
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
    .coupons-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .coupons-table { width: 100%; background: transparent; }
    th, td { padding: 12px; }
    .code { font-family: monospace; font-weight: 600; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px; color: var(--primary); }
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
export class AdminCouponsComponent implements OnInit {
  apiService = inject(ApiService);
  coupons = signal<any[]>([]);
  displayedColumns = ['code', 'type', 'minOrder', 'usage', 'validity', 'status', 'actions'];

  showModal = signal(false);
  isEditMode = signal(false);
  selectedCouponId = signal<number | null>(null);

  formCode = signal('');
  formType = signal('PERCENTAGE');
  formValue = signal<number | null>(0);
  formMinOrderAmount = signal<number | null>(0);
  formMaxDiscountAmount = signal<number | null>(null);
  formUsageLimit = signal<number | null>(100);
  formValidUntil = signal('');
  formIsActive = signal(true);

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.apiService.get<any[]>('/admin/coupons').subscribe({
      next: (data) => this.coupons.set(data),
      error: (err) => console.error('Failed to load coupons', err)
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedCouponId.set(null);
    this.formCode.set('');
    this.formType.set('PERCENTAGE');
    this.formValue.set(0);
    this.formMinOrderAmount.set(0);
    this.formMaxDiscountAmount.set(null);
    this.formUsageLimit.set(100);
    this.formValidUntil.set('');
    this.formIsActive.set(true);
    this.showModal.set(true);
  }

  openEditModal(coupon: any): void {
    this.isEditMode.set(true);
    this.selectedCouponId.set(coupon.id);
    this.formCode.set(coupon.code);
    this.formType.set(coupon.type);
    this.formValue.set(coupon.value);
    this.formMinOrderAmount.set(coupon.minOrderAmount);
    this.formMaxDiscountAmount.set(coupon.maxDiscountAmount);
    this.formUsageLimit.set(coupon.usageLimit);
    this.formValidUntil.set(this.formatDateForInput(coupon.validUntil));
    this.formIsActive.set(coupon.isActive);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveCoupon(): void {
    if (!this.formCode() || !this.formType() || this.formValue() === null || this.formUsageLimit() === null || !this.formValidUntil()) {
      alert('Please fill out all required fields');
      return;
    }

    const payload = {
      code: this.formCode(),
      type: this.formType(),
      value: this.formValue(),
      minOrderAmount: this.formMinOrderAmount() || 0,
      maxDiscountAmount: this.formMaxDiscountAmount(),
      usageLimit: this.formUsageLimit(),
      validUntil: this.formatDateForBackend(this.formValidUntil()),
      validFrom: this.formatDateForBackend(new Date().toISOString()),
      isActive: this.formIsActive()
    };

    if (this.isEditMode()) {
      const id = this.selectedCouponId();
      this.apiService.putRaw<any>(`/admin/coupons/${id}`, payload).subscribe({
        next: () => {
          this.loadCoupons();
          this.closeModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to update coupon')
      });
    } else {
      this.apiService.postRaw<any>('/admin/coupons', payload).subscribe({
        next: () => {
          this.loadCoupons();
          this.closeModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to create coupon')
      });
    }
  }

  deleteCoupon(id: number): void {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.apiService.deleteRaw<any>(`/admin/coupons/${id}`).subscribe({
        next: () => this.loadCoupons(),
        error: (err) => alert(err.error?.message || 'Failed to delete coupon')
      });
    }
  }

  toggleStatus(coupon: any): void {
    const payload = {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount,
      usageLimit: coupon.usageLimit,
      validUntil: this.formatDateForBackend(coupon.validUntil),
      validFrom: this.formatDateForBackend(coupon.validFrom || new Date().toISOString()),
      isActive: !coupon.isActive
    };

    this.apiService.putRaw<any>(`/admin/coupons/${coupon.id}`, payload).subscribe({
      next: () => this.loadCoupons(),
      error: (err) => alert(err.error?.message || 'Failed to update coupon status')
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
