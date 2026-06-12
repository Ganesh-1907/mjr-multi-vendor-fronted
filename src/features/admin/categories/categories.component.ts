import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../core/services/data.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule],
  template: `
    <div class="categories-page">
      <div class="page-header">
        <h1>Category Management</h1>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> Add Category</button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="categories" class="categories-table">
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let cat"><img [src]="cat.image" [alt]="cat.name"></td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let cat">
                <div class="name-cell"><mat-icon>{{cat.icon}}</mat-icon><span>{{cat.name}}</span></div>
              </td>
            </ng-container>
            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef>Slug</th>
              <td mat-cell *matCellDef="let cat">{{cat.slug}}</td>
            </ng-container>
            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Products</th>
              <td mat-cell *matCellDef="let cat">{{cat.productCount}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let cat">{{cat.isActive ? 'Active' : 'Inactive'}}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let cat">
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
    .categories-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .categories-table { width: 100%; }
    th, td { padding: 12px; }
    .categories-table img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; }
    .name-cell { display: flex; align-items: center; gap: 8px; }
    .name-cell mat-icon { color: #1a237e; }
  `]
})
export class AdminCategoriesComponent {
  dataService = inject(DataService);
  categories: Category[] = this.dataService.getCategories();
  displayedColumns = ['image', 'name', 'slug', 'products', 'status', 'actions'];
}
