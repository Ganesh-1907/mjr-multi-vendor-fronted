import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  productSlug?: string;
  productImageUrl: string;
  vendorName?: string;
  vendorId?: number;
  variantName: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  stockQuantity: number;
  subtotal: number;
}

export interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private cartData = signal<CartData>({ items: [], itemCount: 0, subtotal: 0 });
  private loading = signal(false);

  items = computed(() => this.cartData().items);
  itemCount = computed(() => this.cartData().itemCount);
  subtotal = computed(() => this.cartData().subtotal);
  hasItems = computed(() => this.cartData().items.length > 0);
  isLoading = this.loading.asReadonly();
  itemsWithDetails = computed(() => this.cartData().items);

  loadCart(): void {
    if (!this.auth.isAuthenticated()) return;
    this.loading.set(true);
    this.api.get<CartData>('/cart').subscribe({
      next: (data) => { this.cartData.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  addToCart(productId: number, variantId: number, quantity: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>('/cart/items', { productId, variantId, quantity }).subscribe({
        next: () => { this.loadCart(); resolve(); },
        error: (err: any) => reject(err.error?.message || 'Failed to add to cart')
      });
    });
  }

  updateQuantity(cartItemId: number, quantity: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.putRaw<any>(`/cart/items/${cartItemId}`, { quantity }).subscribe({
        next: () => { this.loadCart(); resolve(); },
        error: (err: any) => reject(err.error?.message || 'Failed to update quantity')
      });
    });
  }

  removeItem(cartItemId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.deleteRaw<any>(`/cart/items/${cartItemId}`).subscribe({
        next: () => { this.loadCart(); resolve(); },
        error: (err: any) => reject(err.error?.message || 'Failed to remove item')
      });
    });
  }

  clearCart(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.deleteRaw<any>('/cart').subscribe({
        next: () => { this.cartData.set({ items: [], itemCount: 0, subtotal: 0 }); resolve(); },
        error: (err: any) => reject(err.error?.message || 'Failed to clear cart')
      });
    });
  }

  getVendorById(vendorId: number): string | undefined {
    return undefined;
  }

  updateQuantityByProduct(productId: number, variantId: number, quantity: number): Promise<void> {
    const item = this.cartData().items.find(i => i.productId === productId && i.variantId === variantId);
    if (!item) return Promise.reject('Item not found in cart');
    return this.updateQuantity(item.id, quantity);
  }

  removeItemByProduct(productId: number, variantId: number): Promise<void> {
    const item = this.cartData().items.find(i => i.productId === productId && i.variantId === variantId);
    if (!item) return Promise.reject('Item not found in cart');
    return this.removeItem(item.id);
  }
}
