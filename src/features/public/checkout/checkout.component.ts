import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatDividerModule, MatStepperModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  dataService = inject(DataService);
  router = inject(Router);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  currentStep = signal(0);
  selectedPayment = signal<string>('card');
  orderProcessing = signal(false);
  orderComplete = signal(false);
  orderId = signal<string>('');

  shippingCost = computed(() => this.cart.subtotal() >= 500 ? 0 : 49);
  tax = computed(() => Math.round(this.cart.subtotal() * 0.18));
  total = computed(() => this.cart.subtotal() + this.shippingCost() + this.tax());

  addressForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  paymentForm: FormGroup = this.fb.group({
    cardNumber: [''],
    cardExpiry: [''],
    cardCvv: [''],
    upiId: [''],
    bankName: ['']
  });

  processOrder(): void {
    this.orderProcessing.set(true);

    setTimeout(() => {
      this.orderId.set('ORD-' + Date.now());
      this.orderComplete.set(true);
      this.orderProcessing.set(false);
      this.cart.clearCart();
      this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
    }, 2000);
  }

  getPaymentIcon(): string {
    switch (this.selectedPayment()) {
      case 'card': return 'credit_card';
      case 'upi': return 'phone_android';
      case 'netbanking': return 'account_balance';
      case 'wallet': return 'account_balance_wallet';
      case 'cod': return 'payments';
      default: return 'payment';
    }
  }

  viewOrders(): void {
    this.router.navigate(['/customer/orders']);
  }
}
