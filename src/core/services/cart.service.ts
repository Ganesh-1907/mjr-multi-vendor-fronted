import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product, ProductVariant } from '../models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

export interface CartItemWithDetails {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSignal = signal<CartItem[]>([]);
  private STORAGE_KEY = 'user_cart';

  items = this.cartItemsSignal.asReadonly();

  itemsWithDetails = computed(() => {
    const items = this.cartItemsSignal();
    return items.map(item => {
      const product = this.dataService.getProductById(item.productId);
      const variant = product?.variants.find(v => v.id === item.variantId);
      if (product && variant) {
        return {
          product,
          variant,
          quantity: item.quantity,
          subtotal: variant.price * item.quantity
        };
      }
      return null;
    }).filter((item): item is CartItemWithDetails => item !== null);
  });

  itemCount = computed(() => this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0));

  subtotal = computed(() => this.itemsWithDetails().reduce((sum, item) => sum + item.subtotal, 0));

  hasItems = computed(() => this.cartItemsSignal().length > 0);

  constructor(private dataService: DataService, private authService: AuthService) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[];
        this.cartItemsSignal.set(items);
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  addToCart(productId: string, variantId: string, quantity: number = 1): void {
    const currentItems = this.cartItemsSignal();
    const existingIndex = currentItems.findIndex(i => i.productId === productId && i.variantId === variantId);

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      this.cartItemsSignal.set(updated);
      this.saveCartToStorage(updated);
    } else {
      const updated = [...currentItems, { productId, variantId, quantity }];
      this.cartItemsSignal.set(updated);
      this.saveCartToStorage(updated);
    }
  }

  removeFromCart(productId: string, variantId: string): void {
    const updated = this.cartItemsSignal().filter(i => !(i.productId === productId && i.variantId === variantId));
    this.cartItemsSignal.set(updated);
    this.saveCartToStorage(updated);
  }

  updateQuantity(productId: string, variantId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, variantId);
      return;
    }
    const updated = this.cartItemsSignal().map(i => i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i);
    this.cartItemsSignal.set(updated);
    this.saveCartToStorage(updated);
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isInCart(productId: string, variantId: string): boolean {
    return this.cartItemsSignal().some(i => i.productId === productId && i.variantId === variantId);
  }
}
