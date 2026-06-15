import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  price: number;
  rating: number;
  variantId?: number;
}

export interface WishlistData {
  items: WishlistItem[];
  itemCount: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private wishlistData = signal<WishlistData>({ items: [], itemCount: 0 });
  private loading = signal(false);

  items = computed(() => this.wishlistData().items);
  itemCount = computed(() => this.wishlistData().itemCount);
  isLoading = this.loading.asReadonly();

  loadWishlist(): void {
    if (!this.auth.isAuthenticated()) return;
    this.loading.set(true);
    this.api.get<WishlistData>('/wishlist').subscribe({
      next: (data) => { this.wishlistData.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  addToWishlist(productId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>(`/wishlist/${productId}`, {}).subscribe({
        next: () => { this.loadWishlist(); resolve(); },
        error: (err) => reject(err.error?.message || 'Failed to add to wishlist')
      });
    });
  }

  removeFromWishlist(productId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.deleteRaw<any>(`/wishlist/${productId}`).subscribe({
        next: () => { this.loadWishlist(); resolve(); },
        error: (err) => reject(err.error?.message || 'Failed to remove from wishlist')
      });
    });
  }

  toggleWishlist(productId: number): Promise<void> {
    if (this.isInWishlist(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistData().items.some(i => i.productId === productId);
  }
}
