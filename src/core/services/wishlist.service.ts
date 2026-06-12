import { Injectable, signal, computed } from '@angular/core';
import { WishlistItem as WishlistItemModel, Product } from '../models';
import { DataService } from './data.service';

export interface WishlistItemWithProduct {
  productId: string;
  product: Product;
  addedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistSignal = signal<string[]>([]);
  private STORAGE_KEY = 'user_wishlist';

  wishlistIds = this.wishlistSignal.asReadonly();

  items = computed(() => {
    const ids = this.wishlistSignal();
    return ids.map(id => {
      const product = this.dataService.getProductById(id);
      if (product) {
        return { productId: id, product, addedAt: new Date() };
      }
      return null;
    }).filter((item): item is WishlistItemWithProduct => item !== null);
  });

  itemCount = computed(() => this.wishlistSignal().length);

  constructor(private dataService: DataService) {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored) as string[];
        this.wishlistSignal.set(items);
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private saveWishlistToStorage(items: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  addToWishlist(productId: string): void {
    const current = this.wishlistSignal();
    if (!current.includes(productId)) {
      const updated = [...current, productId];
      this.wishlistSignal.set(updated);
      this.saveWishlistToStorage(updated);
    }
  }

  removeFromWishlist(productId: string): void {
    const updated = this.wishlistSignal().filter(id => id !== productId);
    this.wishlistSignal.set(updated);
    this.saveWishlistToStorage(updated);
  }

  toggleWishlist(productId: string): void {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistSignal().includes(productId);
  }

  moveAllToCart(): void {
    this.wishlistSignal().forEach(productId => {
      const product = this.dataService.getProductById(productId);
      if (product && product.variants.length > 0) {
      }
    });
    this.clearWishlist();
  }

  clearWishlist(): void {
    this.wishlistSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
