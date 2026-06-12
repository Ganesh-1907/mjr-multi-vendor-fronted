import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductVariant, ProductReview } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatTabsModule, MatChipsModule, MatInputModule, MatFormFieldModule, MatExpansionModule, MatDividerModule, MatCardModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private dataService = inject(DataService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  selectedImage = signal<string>('');
  selectedVariant = signal<ProductVariant | null>(null);
  quantity = signal(1);

  product: Product | undefined;

  get primaryImage(): string {
    return this.selectedImage() || this.product?.images.find(img => img.isPrimary)?.url ||
      this.product?.images[0]?.url || '';
  }

  get images(): string[] {
    return this.product?.images.map(img => img.url) || [];
  }

  get vendor() {
    return this.product ? this.dataService.getVendorById(this.product.vendorId) : null;
  }

  get category() {
    return this.product ? this.dataService.getCategoryById(this.product.categoryId) : null;
  }

  get reviews(): ProductReview[] {
    return this.product ? this.dataService.getReviewsForProduct(this.product.id) : [];
  }

  get relatedProducts() {
    return this.product ? this.dataService.getProductsByCategory(this.product.categoryId).filter(p => p.id !== this.product?.id).slice(0, 4) : [];
  }

  get discount(): number {
    const variant = this.selectedVariant();
    if (variant?.comparePrice) {
      return Math.round(((variant.comparePrice - variant.price) / variant.comparePrice) * 100);
    }
    return 0;
  }

  get totalPrice(): number {
    const variant = this.selectedVariant();
    return variant ? variant.price * this.quantity() : 0;
  }

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.product = this.dataService.getProductById(slug.replace('product-', ''));
    }
    if (this.product) {
      this.selectedImage.set(this.product.images[0]?.url || '');
      this.selectedVariant.set(this.product.variants[0] || null);
    }
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant.set(variant);
  }

  updateQuantity(delta: number): void {
    const newQty = Math.max(1, this.quantity() + delta);
    const stock = this.selectedVariant()?.stock || 0;
    this.quantity.set(Math.min(newQty, stock));
  }

  addToCart(): void {
    const variant = this.selectedVariant();
    if (this.product && variant) {
      this.cart.addToCart(this.product.id, variant.id, this.quantity());
      this.snackBar.open('Added to cart', 'View Cart', { duration: 3000 });
    }
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  toggleWishlist(): void {
    if (this.product) {
      this.wishlist.toggleWishlist(this.product.id);
      const message = this.wishlist.isInWishlist(this.product.id) ? 'Added to wishlist' : 'Removed from wishlist';
      this.snackBar.open(message, 'Close', { duration: 2000 });
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlist.isInWishlist(this.product.id) : false;
  }

  goBack(): void {
    this.location.back();
  }
}
