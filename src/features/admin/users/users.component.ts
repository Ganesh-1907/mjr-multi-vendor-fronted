import { Component, inject, signal, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatCardModule, MatTableModule,
    MatChipsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatTooltipModule,
    MatMenuModule, MatPaginatorModule, MatSortModule
  ],
  template: `
    <div class="users-page">
      <div class="page-header">
        <h1>Customer Management</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search customers</mat-label>
            <input matInput (keyup)="applyFilter($event)" #searchInput>
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          <button mat-stroked-button color="primary" (click)="exportCSV()">
            <mat-icon>download</mat-icon> Export CSV
          </button>
        </div>
      </div>
      <mat-card>
        <mat-card-content class="table-container">
          <table mat-table [dataSource]="dataSource" matSort [trackBy]="trackByUserId" class="users-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer ID</th>
              <td mat-cell *matCellDef="let customer">
                <span class="customer-id">#{{customer._id}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
              <td mat-cell *matCellDef="let customer">
                <div class="user-info">
                  <div class="avatar">{{customer.firstName?.[0]}}{{customer.lastName?.[0]}}</div>
                  <div class="user-name-group">
                    <span class="user-name">{{customer.firstName}} {{customer.lastName}}</span>
                    <span class="user-email-secondary">{{customer.email}}</span>
                  </div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
              <td mat-cell *matCellDef="let customer">{{customer.phone || 'N/A'}}</td>
            </ng-container>
            <ng-container matColumnDef="orders">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="orderCount">Orders</th>
              <td mat-cell *matCellDef="let customer">{{customer.orderCount || 0}}</td>
            </ng-container>
            <ng-container matColumnDef="joined">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="createdAt">Joined</th>
              <td mat-cell *matCellDef="let customer">{{customer.createdAt | date:'mediumDate'}}</td>
            </ng-container>
            <ng-container matColumnDef="lastLogin">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Login</th>
              <td mat-cell *matCellDef="let customer">
                <span [class.never-login]="!customer.lastLogin">
                  {{customer.lastLogin ? (customer.lastLogin | date:'mediumDate') : 'Never'}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="isActive">Status</th>
              <td mat-cell *matCellDef="let customer">
                <mat-chip [color]="customer.isActive !== false ? 'primary' : 'warn'">
                  {{customer.isActive !== false ? 'Active' : 'Blocked'}}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let customer">
                <button mat-icon-button [matMenuTriggerFor]="menu" title="Actions">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  @if (customer.isActive !== false) {
                    <button mat-menu-item (click)="changeUserStatus(customer, false)">
                      <mat-icon color="warn">block</mat-icon>
                      <span>Block Customer</span>
                    </button>
                  } @else {
                    <button mat-menu-item (click)="changeUserStatus(customer, true)">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>Activate Customer</span>
                    </button>
                  }
                </mat-menu>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <tr class="mat-row empty-state-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayedColumns.length" style="text-align: center; padding: 24px; color: #757575;">
                No customers found matching the search.
              </td>
            </tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" aria-label="Select page of users"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-page { max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { margin: 0; }
    .header-actions { display: flex; gap: 16px; align-items: center; }
    .search-field { width: 320px; }
    ::ng-deep .search-field .mat-mdc-form-field-subscript-wrapper { display: none; }
    .table-container { overflow-x: auto; max-height: 600px; padding: 0 !important; }
    .users-table { width: 100%; }
    th { background: #f8f9fa !important; font-weight: 600; color: rgba(0,0,0,0.7); white-space: nowrap; }
    td { vertical-align: middle; }
    .customer-id { font-family: monospace; font-size: 13px; color: #616161; font-weight: 500; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #1a237e; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; flex-shrink: 0; }
    .user-name-group { display: flex; flex-direction: column; }
    .user-name { font-weight: 500; }
    .user-email-secondary { font-size: 12px; color: #757575; }
    .never-login { color: #9e9e9e; font-style: italic; }
    .status-select { width: 130px; }
    .status-select ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .status-select ::ng-deep .mat-mdc-form-field-infix { min-height: 40px; padding: 6px 0; }
    .status-select ::ng-deep .mat-mdc-text-field-wrapper { padding: 0 8px; }
    .status-option { display: flex; align-items: center; gap: 8px; }
    .status-option::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
    .status-active::before { background: #4caf50; }
    .status-blocked::before { background: #f44336; }
    @media (max-width: 768px) { .search-field { width: 100%; } .users-table { display: block; overflow-x: auto; } }
  `]
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);

  users = signal<any[]>([]);
  searchQuery = signal('');
  displayedColumns = ['id', 'name', 'phone', 'orders', 'joined', 'lastLogin', 'status', 'actions'];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.apiData.getAdminUsers().subscribe(data => {
      this.users.set(data);
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'name': return (item.firstName + ' ' + item.lastName).toLowerCase();
        default: return item[property];
      }
    };
    
    // Custom filter predicate to match multiple fields
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const q = filter.toLowerCase();
      return String(data._id).includes(q) ||
        (data.firstName?.toLowerCase() || '').includes(q) ||
        (data.lastName?.toLowerCase() || '').includes(q) ||
        (data.email?.toLowerCase() || '').includes(q) ||
        (data.phone?.toLowerCase() || '').includes(q);
    };
  }

  trackByUserId(index: number, user: any): any {
    return user._id;
  }

  applyFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchQuery.set(query);
    this.dataSource.filter = query;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportCSV(): void {
    const data = this.dataSource.filteredData;
    if (!data || data.length === 0) {
      this.snackBar.open('No data available to export', 'Close', { duration: 3000 });
      return;
    }
    
    const headers = 'Customer ID,First Name,Last Name,Email,Phone,Orders,Joined Date,Status';
    const csvRows = data.map(u => 
      `${u._id},"${u.firstName || ''}","${u.lastName || ''}","${u.email || ''}","${u.phone || ''}",${u.orderCount || 0},"${new Date(u.createdAt).toLocaleDateString()}","${u.isActive !== false ? 'Active' : 'Blocked'}"`
    );
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  changeUserStatus(customer: any, isActive: boolean): void {
    if (customer.isActive === isActive || (customer.isActive !== false && isActive)) {
      return;
    }
    const action = isActive ? 'Activate' : 'Block';
    if (!confirm(`${action} customer "${customer.firstName} ${customer.lastName}"?`)) {
      return;
    }
    this.apiData.updateUserStatus(customer._id, isActive).subscribe({
      next: () => {
        this.snackBar.open(
          `Customer ${isActive ? 'activated' : 'blocked'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.users.update(list =>
          list.map((u: any) => u._id === customer._id ? { ...u, isActive } : u)
        );
        this.dataSource.data = this.users();
      },
      error: () => {
        this.snackBar.open('Failed to update customer status', 'Close', { duration: 3000 });
      }
    });
  }
}
