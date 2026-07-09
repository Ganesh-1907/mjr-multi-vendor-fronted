import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductPreview } from '../../../core/services/api-data.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule, MatCardModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: ProductPreview;
  @Input() showVendor = true;

  cart = inject(CartService);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  get primaryImage(): string {
    return this.product.primaryImageUrl || 'assets/placeholder.png';
  }

  get primaryVariant(): any {
    return { price: this.product.primaryVariantPrice, comparePrice: this.product.primaryVariantComparePrice, id: this.product.primaryVariantId };
  }

  get discount(): number {
    return this.product.discountPercent || 0;
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'addToCart',
        productId: this.product.id,
        variantId: this.primaryVariant.id,
        quantity: 1
      }));
      this.router.navigate(['/auth/login'], {
        queryParams: { role: 'customer', redirectTo: this.router.url }
      });
      return;
    }

    this.cart.addToCart(this.product.id, this.primaryVariant.id).then(() => {
      this.snackBar.open('Added to cart', 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    }).catch(err => {
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'toggleWishlist',
        productId: this.product.id
      }));
      this.router.navigate(['/auth/login'], {
        queryParams: { role: 'customer', redirectTo: this.router.url }
      });
      return;
    }

    this.wishlist.toggleWishlist(this.product.id).then(() => {
      const message = this.wishlist.isInWishlist(this.product.id) ? 'Added to wishlist' : 'Removed from wishlist';
      this.snackBar.open(message, 'Close', { duration: 2000 });
    }).catch(err => {
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });
  }

  isInWishlist(): boolean {
    return this.wishlist.isInWishlist(this.product.id);
  }
}
