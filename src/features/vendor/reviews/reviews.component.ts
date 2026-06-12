import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-vendor-reviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule],
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <h1>Product Reviews</h1>
        <p>Manage customer reviews for your products</p>
      </div>
      <div class="reviews-list">
        @for (review of reviews; track review.id) {
          <mat-card class="review-card">
            <mat-card-content>
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="avatar">{{review.customerName[0]}}</div>
                  <div>
                    <span class="name">{{review.customerName}}</span>
                    <span class="date">{{review.createdAt | date:'mediumDate'}}</span>
                  </div>
                </div>
                <div class="rating">
                  <mat-icon>star</mat-icon>&nbsp;{{review.rating}}
                </div>
              </div>
              <h3 class="review-title">{{review.title}}</h3>
              <p class="review-comment">{{review.comment}}</p>
              <div class="product-info">
                @if (getProduct(review.productId); as product) {
                  <img [src]="product.images[0]?.url">
                  <span>{{product.name}}</span>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .reviews-page { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .reviews-list { display: flex; flex-direction: column; gap: 16px; }
    .review-card { padding: 16px; }
    .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .reviewer-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #1a237e; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .name { font-weight: 500; display: block; }
    .date { font-size: 13px; color: #757575; }
    .rating { display: flex; align-items: center; font-weight: 600; color: #f57c00; }
    .rating mat-icon { color: #f57c00; }
    .review-title { margin-bottom: 8px; font-size: 16px; }
    .review-comment { color: #616161; line-height: 1.6; margin-bottom: 16px; }
    .product-info { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px; }
    .product-info img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }
  `]
})
export class VendorReviewsComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);

  reviews = this.dataService.getReviews();
  getProduct(id: string) { return this.dataService.getProductById(id); }
}
