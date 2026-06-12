import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../../core/services/data.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="categories-page">
      <div class="page-header">
        <h1>All Categories</h1>
        <p>Browse products by category</p>
      </div>
      <div class="categories-grid">
        @for (category of categories; track category.id) {
          <a [routerLink]="['/products']" [queryParams]="{category: category.slug}" class="category-card">
            <mat-card>
              <div class="category-image">
                <img [src]="category.image" [alt]="category.name">
              </div>
              <mat-card-content>
                <div class="icon-wrapper">
                  <mat-icon>{{category.icon}}</mat-icon>
                </div>
                <h2>{{category.name}}</h2>
                <p>{{category.productCount}} Products</p>
              </mat-card-content>
            </mat-card>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .categories-page { padding: 32px 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { text-align: center; margin-bottom: 40px; }
    .page-header h1 { font-size: 32px; margin-bottom: 8px; }
    .page-header p { color: #757575; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; }
    .category-card { text-decoration: none; }
    .category-card mat-card { transition: transform 0.2s, box-shadow 0.2s; }
    .category-card:hover mat-card { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .category-image { height: 160px; overflow: hidden; }
    .category-image img { width: 100%; height: 100%; object-fit: cover; }
    mat-card-content { text-align: center; padding: 16px !important; }
    .icon-wrapper mat-icon { font-size: 36px; color: #1a237e; margin-bottom: 12px; }
    mat-card-content h2 { font-size: 18px; margin-bottom: 4px; }
    mat-card-content p { color: #757575; font-size: 14px; }
  `]
})
export class CategoriesComponent {
  private dataService = inject(DataService);
  categories: Category[] = this.dataService.getCategories();
}
