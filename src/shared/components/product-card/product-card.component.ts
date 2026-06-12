import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../core/models';
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
  @Input() product!: Product;
  @Input() showVendor = true;

  cart = inject(CartService);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  get primaryImage(): string {
    return this.product.images.find(img => img.isPrimary)?.url || this.product.images[0]?.url || 'assets/placeholder.png';
  }

  get primaryVariant() {
    return this.product.variants[0];
  }

  get discount(): number {
    if (this.primaryVariant?.comparePrice) {
      return Math.round(((this.primaryVariant.comparePrice - this.primaryVariant.price) / this.primaryVariant.comparePrice) * 100);
    }
    return 0;
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.product.variants.length > 0) {
      this.cart.addToCart(this.product.id, this.product.variants[0].id);
      this.snackBar.open('Added to cart', 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    }
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.toggleWishlist(this.product.id);
    const message = this.wishlist.isInWishlist(this.product.id) ? 'Added to wishlist' : 'Removed from wishlist';
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  isInWishlist(): boolean {
    return this.wishlist.isInWishlist(this.product.id);
  }
}
