import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService } from '../../../core/services/data.service';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="users-page">
      <div class="page-header">
        <h1>Customer Management</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search customers</mat-label>
          <input matInput>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="customers" class="users-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let customer">
                <div class="user-info">
                  <div class="avatar">{{customer.firstName[0]}}{{customer.lastName[0]}}</div>
                  <span>{{customer.firstName}} {{customer.lastName}}</span>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let customer">{{customer.email}}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let customer">{{customer.phone}}</td>
            </ng-container>
            <ng-container matColumnDef="orders">
              <th mat-header-cell *matHeaderCellDef>Orders</th>
              <td mat-cell *matCellDef="let customer">0</td>
            </ng-container>
            <ng-container matColumnDef="joined">
              <th mat-header-cell *matHeaderCellDef>Joined</th>
              <td mat-cell *matCellDef="let customer">{{customer.createdAt | date:'shortDate'}}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let customer">
                <button mat-icon-button><mat-icon>visibility</mat-icon></button>
                <button mat-icon-button color="warn"><mat-icon>block</mat-icon></button>
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
    .users-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .search-field { width: 300px; }
    .users-table { width: 100%; }
    th, td { padding: 12px; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: #1a237e; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
    @media (max-width: 600px) { .search-field { width: 100%; } }
  `]
})
export class AdminUsersComponent {
  dataService = inject(DataService);
  snackBar = inject(MatSnackBar);
  customers: Customer[] = this.dataService.getCustomers();
  displayedColumns = ['name', 'email', 'phone', 'orders', 'joined', 'actions'];
}
