import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistService, WishlistItem } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
        <h1>My Wishlist</h1>
        <p>{{wishlist.itemCount()}} items saved</p>
      </div>

      @if (wishlist.items().length > 0) {
        <div class="wishlist-grid">
          @for (item of wishlist.items(); track item.id) {
            <mat-card class="wishlist-item">
              <div class="item-image">
                <img [src]="item.productImageUrl" [alt]="item.productName">
                <button mat-icon-button class="remove-btn" (click)="remove($event, item.productId)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <mat-card-content>
                <h3>{{item.productName}}</h3>
                <div class="price-row">
                  <span class="price">INR {{item.price | number:'1.0-0'}}</span>
                </div>
                <div class="rating-row">
                  <span class="rating"><mat-icon>star</mat-icon> {{item.rating | number:'1.1-1'}}</span>
                </div>
                <button mat-raised-button color="primary" class="add-to-cart-btn" (click)="addToCart($event, item)">
                  <mat-icon>shopping_cart</mat-icon> Add to Cart
                </button>
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <div class="empty-wishlist">
          <mat-icon>favorite_border</mat-icon>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later</p>
          <button mat-raised-button color="primary" routerLink="/products">Explore Products</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-page { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; margin-bottom: 8px; }
    .page-header p { color: #757575; }
    .wishlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .wishlist-item { transition: transform 0.2s; }
    .wishlist-item:hover { transform: translateY(-4px); }
    .item-image { position: relative; height: 200px; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .remove-btn { position: absolute; top: 8px; right: 8px; background: white; }
    mat-card-content { padding: 16px !important; }
    mat-card-content h3 { font-size: 14px; margin-bottom: 8px; line-height: 1.4; }
    .price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
    .price { font-size: 18px; font-weight: 700; color: #1a237e; }
    .rating-row { margin-bottom: 12px; }
    .rating { display: inline-flex; align-items: center; gap: 2px; background: #388e3c; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .rating mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .add-to-cart-btn { width: 100%; }
    .empty-wishlist { text-align: center; padding: 80px 24px; background: white; border-radius: 12px; }
    .empty-wishlist mat-icon { font-size: 80px; width: 80px; height: 80px; color: #bdbdbd; margin-bottom: 16px; }
  `]
})
export class WishlistComponent implements OnInit {
  wishlist = inject(WishlistService);
  cart = inject(CartService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.wishlist.loadWishlist();
  }

  remove(event: Event, productId: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.removeFromWishlist(productId).then(() => {
      this.snackBar.open('Removed from wishlist', 'Close', { duration: 2000 });
    });
  }

  addToCart(event: Event, item: WishlistItem): void {
    event.preventDefault();
    event.stopPropagation();
    const variantId = item.variantId || 0;
    this.cart.addToCart(item.productId, variantId, 1).then(() => {
      this.wishlist.removeFromWishlist(item.productId).then(() => {
        this.snackBar.open('Moved item to cart', 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      }).catch(() => {
        this.snackBar.open('Added to cart', 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      });
    }).catch((err) => {
      this.snackBar.open(err || 'Failed to add to cart', 'Close', { duration: 4000 });
    });
  }
}
