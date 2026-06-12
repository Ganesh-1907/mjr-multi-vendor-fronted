import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cart = inject(CartService);
  dataService = inject(DataService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  couponCode = '';
  discount = 0;
  appliedCoupon = '';

  shippingCost = computed(() => this.cart.subtotal() >= 500 ? 0 : 49);
  tax = computed(() => Math.round(this.cart.subtotal() * 0.18));
  total = computed(() => this.cart.subtotal() - this.discount + this.shippingCost() + this.tax());

  updateQuantity(productId: string, variantId: string, quantity: number): void {
    this.cart.updateQuantity(productId, variantId, quantity);
  }

  removeItem(productId: string, variantId: string): void {
    this.cart.removeFromCart(productId, variantId);
    this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
  }

  clearCart(): void {
    this.cart.clearCart();
    this.snackBar.open('Cart cleared', 'Close', { duration: 2000 });
  }

  applyCoupon(): void {
    const coupon = this.dataService.validateCoupon(this.couponCode);
    if (coupon) {
      if (coupon.minOrderAmount > this.cart.subtotal()) {
        this.snackBar.open(`Minimum order INR ${coupon.minOrderAmount} required`, 'Close', { duration: 2000 });
        return;
      }
      if (coupon.type === 'percentage') {
        this.discount = Math.min(Math.round(this.cart.subtotal() * coupon.value / 100), coupon.maxDiscount);
      } else {
        this.discount = coupon.value;
      }
      this.appliedCoupon = coupon.code;
      this.snackBar.open(`Coupon ${coupon.code} applied!`, 'Close', { duration: 2000 });
    } else {
      this.snackBar.open('Invalid or expired coupon', 'Close', { duration: 2000 });
    }
    this.couponCode = '';
  }

  removeCoupon(): void {
    this.discount = 0;
    this.appliedCoupon = '';
    this.snackBar.open('Coupon removed', 'Close', { duration: 2000 });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
