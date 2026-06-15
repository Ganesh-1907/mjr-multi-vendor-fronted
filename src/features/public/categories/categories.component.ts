import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ApiDataService, Category } from '../../../core/services/api-data.service';

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
      @if (loading()) {
        <div class="skeleton-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="category-card skeleton">
              <div class="category-image skeleton-bg"></div>
              <div class="card-body">
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
          }
        </div>
      } @else if (categories().length > 0) {
        <div class="categories-grid">
          @for (category of categories(); track category.id) {
            <a [routerLink]="['/products']" [queryParams]="{category: category.slug}" class="category-card">
              <div class="category-image">
                <img [src]="category.imageUrl || 'assets/images/placeholder.svg'" [alt]="category.name" (error)="onImageError($event)">
              </div>
              <div class="card-body">
                <h2>{{category.name}}</h2>
                @if (category.productCount !== undefined) {
                  <p class="product-count">{{category.productCount}} Products</p>
                }
              </div>
            </a>
          }
        </div>
      } @else {
        <p class="no-categories">No categories available.</p>
      }
    </div>
  `,
  styles: [`
    .categories-page { width: 100%; max-width: none; margin: 0; padding: 0; }
    .page-header { text-align: center; padding: 50px 24px; background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); color: white; margin: 0 0 40px 0; box-shadow: var(--shadow-sm); }
    .page-header h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; color: white !important; letter-spacing: -0.5px; }
    .page-header p { opacity: 0.85; color: white !important; font-size: 16px; margin: 0; }
    .loading-text, .no-categories { text-align: center; color: var(--text-secondary); padding: 48px; }

    .categories-grid, .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 1800px;
      margin: 0 auto;
      padding: 0 24px 48px;
      box-sizing: border-box;
    }

    .category-card {
      text-decoration: none;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-light);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .category-card:not(.skeleton):hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .category-image {
      height: 170px;
      overflow: hidden;
      background: var(--bg-tertiary);
    }
    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .category-card:not(.skeleton):hover .category-image img {
      transform: scale(1.06);
    }

    .card-body {
      padding: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
      margin-top: -48px;
      margin-bottom: 14px;
      border: 3px solid var(--bg-secondary);
    }
    .icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--primary);
    }
    .card-body h2 {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 4px 0;
    }
    .product-count {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 0;
    }

    /* Skeletons */
    .category-card.skeleton {
      cursor: default;
    }
    .category-card.skeleton .card-body {
      gap: 10px;
    }
    .skeleton-bg {
      background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin-top: 0;
    }
    .skeleton-line {
      width: 120px;
      height: 14px;
      border-radius: 4px;
      background: var(--bg-tertiary);
    }
    .skeleton-line.short {
      width: 80px;
      height: 10px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private apiData = inject(ApiDataService);

  categories = signal<Category[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.apiData.getCategories().subscribe({
      next: (cats) => { this.categories.set(cats); this.loading.set(false); },
      error: () => { this.categories.set([]); this.loading.set(false); }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%23e2e8f0%27 width=%27400%27 height=%27300%27/%3E%3Ctext fill=%27%2394a3b8%27 font-family=%27sans-serif%27 font-size=%2718%27 text-anchor=%27middle%27 x=%27200%27 y=%27160%27%3ENo Image%3C/text%3E%3C/svg%3E';
  }
}
