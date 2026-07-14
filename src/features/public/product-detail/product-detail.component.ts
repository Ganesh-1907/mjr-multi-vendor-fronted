import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { ApiDataService, Product, ProductVariant, Review, ProductPreview, Category, Vendor } from '../../../core/services/api-data.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatTabsModule, MatChipsModule, MatInputModule, MatFormFieldModule, MatExpansionModule, MatDividerModule, MatCardModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private apiData = inject(ApiDataService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  product = signal<Product | null>(null);
  vendor = signal<Vendor | null>(null);
  category = signal<Category | null>(null);
  reviews = signal<Review[]>([]);
  relatedProducts = signal<ProductPreview[]>([]);

  selectedImage = signal<string>('');
  selectedVariant = signal<ProductVariant | null>(null);
  quantity = signal(1);

  primaryImage = computed(() => {
    const prod = this.product();
    return this.selectedImage() || prod?.images.find(img => img.isPrimary)?.url ||
      prod?.images[0]?.url || '';
  });

  images = computed(() => this.product()?.images.map(img => img.url) || []);

  discount = computed(() => {
    const variant = this.selectedVariant();
    if (variant?.comparePrice) {
      return Math.round(((variant.comparePrice - variant.price) / variant.comparePrice) * 100);
    }
    return 0;
  });

  totalPrice = computed(() => {
    const variant = this.selectedVariant();
    return variant ? variant.price * this.quantity() : 0;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.apiData.getProductBySlug(slug).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.selectedImage.set(prod.images[0]?.url || '');
        this.selectedVariant.set(prod.variants[0] || null);
        this.loadVendor(prod.vendorId);
        this.loadCategory(prod.categoryId);
        this.loadReviews(prod.id);
        this.loadRelatedProducts(prod.id);
      },
      error: () => this.product.set(null)
    });
  }

  private loadVendor(vendorId: number): void {
    this.apiData.getVendorById(vendorId).subscribe({
      next: (v) => this.vendor.set(v),
      error: () => this.vendor.set(null)
    });
  }

  private loadCategory(categoryId: number): void {
    this.apiData.getCategories().subscribe({
      next: (cats) => {
        const cat = cats.find(c => c.id === categoryId);
        this.category.set(cat || null);
      },
      error: () => this.category.set(null)
    });
  }

  private loadReviews(productId: number): void {
    this.apiData.getReviewsForProduct(productId).subscribe({
      next: (revs) => this.reviews.set(revs),
      error: () => this.reviews.set([])
    });
  }

  private loadRelatedProducts(productId: number): void {
    this.apiData.getRelatedProducts(productId).subscribe({
      next: (prods) => this.relatedProducts.set(prods.slice(0, 4)),
      error: () => this.relatedProducts.set([])
    });
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
    const prod = this.product();
    if (!prod || !variant) return;

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'addToCart',
        productId: prod.id,
        variantId: variant.id,
        quantity: this.quantity()
      }));
      this.router.navigate(['/auth/login'], {
        queryParams: { role: 'customer', redirectTo: this.router.url }
      });
      return;
    }

    this.cart.addToCart(prod.id, variant.id, this.quantity()).then(() => {
      this.snackBar.open('Added to cart', 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    }).catch(err => {
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });
  }

  buyNow(): void {
    const variant = this.selectedVariant();
    const prod = this.product();
    if (!prod || !variant) return;

    const buyNowItem = {
      id: `buynow_${Date.now()}`,
      productId: prod.id,
      variantId: variant.id,
      quantity: this.quantity(),
      productName: prod.name,
      productImageUrl: this.primaryImage(),
      subtotal: variant.price * this.quantity(),
      price: variant.price,
      variantName: variant.name
    };

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
      this.router.navigate(['/auth/login'], {
        queryParams: { role: 'customer', redirectTo: '/checkout' }
      });
      return;
    }

    this.router.navigate(['/checkout'], { state: { buyNowItem } });
  }

  toggleWishlist(): void {
    const prod = this.product();
    if (!prod) return;

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('pending_action', JSON.stringify({
        type: 'toggleWishlist',
        productId: prod.id
      }));
      this.router.navigate(['/auth/login'], {
        queryParams: { role: 'customer', redirectTo: this.router.url }
      });
      return;
    }

    this.wishlist.toggleWishlist(prod.id).then(() => {
      const message = this.wishlist.isInWishlist(prod.id) ? 'Added to wishlist' : 'Removed from wishlist';
      this.snackBar.open(message, 'Close', { duration: 2000 });
    }).catch(err => {
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });
  }

  isInWishlist(): boolean {
    const prod = this.product();
    return prod ? this.wishlist.isInWishlist(prod.id) : false;
  }

  goBack(): void {
    this.location.back();
  }
}
