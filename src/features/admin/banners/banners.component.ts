import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../../core/services/data.service';
import { Banner } from '../../../core/models';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="banners-page">
      <div class="page-header">
        <h1>Banner Management</h1>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> Create Banner</button>
      </div>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="banners" class="banners-table">
            <ng-container matColumnDef="preview">
              <th mat-header-cell *matHeaderCellDef>Preview</th>
              <td mat-cell *matCellDef="let banner"><img [src]="banner.image" [alt]="banner.title"></td>
            </ng-container>
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let banner">{{banner.title}}</td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>Position</th>
              <td mat-cell *matCellDef="let banner">{{banner.position}}</td>
            </ng-container>
            <ng-container matColumnDef="link">
              <th mat-header-cell *matHeaderCellDef>Link</th>
              <td mat-cell *matCellDef="let banner">{{banner.link}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let banner">
                <mat-chip [color]="banner.isActive ? 'primary' : 'warn'">{{banner.isActive ? 'Active' : 'Inactive'}}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let banner">
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
    .banners-page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .banners-table { width: 100%; }
    th, td { padding: 12px; }
    .banners-table img { width: 120px; height: 60px; object-fit: cover; border-radius: 4px; }
    mat-chip { font-size: 12px; min-height: 24px; }
  `]
})
export class AdminBannersComponent {
  dataService = inject(DataService);
  banners: Banner[] = this.dataService.getBanners();
  displayedColumns = ['preview', 'title', 'position', 'link', 'status', 'actions'];
}
