import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  apiData = inject(ApiDataService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cart.loadCart();
  }

  shippingCost = computed(() => this.cart.subtotal() >= 500 ? 0 : 49);
  tax = computed(() => Math.round(this.cart.subtotal() * 0.18));
  total = computed(() => this.cart.subtotal() + this.shippingCost() + this.tax());

  updateQuantity(cartItemId: number, quantity: number): void {
    this.cart.updateQuantity(cartItemId, quantity);
  }

  removeItem(cartItemId: number): void {
    this.cart.removeItem(cartItemId).then(() => {
      this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
    });
  }

  clearCart(): void {
    this.cart.clearCart().then(() => {
      this.snackBar.open('Cart cleared', 'Close', { duration: 2000 });
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
