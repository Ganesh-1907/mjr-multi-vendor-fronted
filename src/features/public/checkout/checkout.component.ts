import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatSelectModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cart = inject(CartService);
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  router = inject(Router);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  orderProcessing = signal(false);
  orderComplete = signal(false);
  orderId = signal<string>('');
  placedOrder = signal<any>(null);
  savedAddresses = signal<any[]>([]);
  selectedAddress = signal<any>(null);

  ngOnInit(): void {
    const state = history.state;
    if (state && state.buyNowItem) {
      this.buyNowItem.set(state.buyNowItem);
    } else {
      const localBuyNow = localStorage.getItem('buyNowItem');
      if (localBuyNow) {
        try {
          this.buyNowItem.set(JSON.parse(localBuyNow));
        } catch (e) {}
        localStorage.removeItem('buyNowItem');
      }
    }
    this.loadSavedAddresses();
  }

  loadSavedAddresses(): void {
    this.apiData.getAddresses().subscribe({
      next: (data) => {
        this.savedAddresses.set(data);
        const defaultAddr = data.find(addr => addr.isDefault) || data[0] || null;
        this.selectedAddress.set(defaultAddr);
        if (defaultAddr) {
          this.prefillAddress(defaultAddr);
        }
      }
    });
  }

  prefillAddress(address: any): void {
    this.addressForm.patchValue({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
  }

  onAddressSelect(address: any): void {
    this.selectedAddress.set(address);
    if (address) {
      this.prefillAddress(address);
    } else {
      this.addressForm.reset({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
      });
    }
  }

  couponCode = '';
  discount = signal(0);
  appliedCoupon = signal('');

  buyNowItem = signal<any>(null);

  checkoutItems = computed(() => {
    const buyNow = this.buyNowItem();
    if (buyNow) {
      return [buyNow];
    }
    return this.cart.itemsWithDetails();
  });

  checkoutSubtotal = computed(() => {
    const buyNow = this.buyNowItem();
    if (buyNow) {
      return buyNow.subtotal;
    }
    return this.cart.subtotal();
  });

  shippingCost = computed(() => 100);
  tax = computed(() => Math.round(this.checkoutSubtotal() * 0.18));
  total = computed(() => this.checkoutSubtotal() - this.discount() + this.shippingCost() + this.tax());

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.apiData.validateCoupon(this.couponCode.trim(), this.checkoutSubtotal()).subscribe({
      next: (res) => {
        this.discount.set(res.discountAmount);
        this.appliedCoupon.set(res.coupon.code);
        this.snackBar.open(`Coupon ${res.coupon.code} applied!`, 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Invalid or expired coupon', 'Close', { duration: 2000 });
      }
    });
    this.couponCode = '';
  }

  removeCoupon(): void {
    this.discount.set(0);
    this.appliedCoupon.set('');
    this.snackBar.open('Coupon removed', 'Close', { duration: 2000 });
  }

  addressForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  initiatePayment(): void {
    if (this.addressForm.invalid) {
      this.snackBar.open('Please fill in all required address fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.total() <= 0) {
      this.snackBar.open('Your cart is empty', 'Close', { duration: 2000 });
      return;
    }

    this.orderProcessing.set(true);

    this.apiData.createRazorpayOrder(this.total()).subscribe({
      next: (orderData) => {
        this.openRazorpayCheckout(orderData);
      },
      error: (err) => {
        this.orderProcessing.set(false);
        const msg = err.error?.message || err.message || 'Failed to initiate payment';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  openRazorpayCheckout(orderData: any): void {
    if (typeof Razorpay === 'undefined') {
      this.orderProcessing.set(false);
      this.snackBar.open('Payment gateway is loading. Please wait and try again.', 'Close', { duration: 4000 });
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || environment.currencyCode,
      name: 'N-CommerceHub',
      description: 'Order Payment',
      order_id: orderData.id,
      handler: (response: any) => {
        this.verifyAndPlaceOrder(response);
      },
      prefill: {
        name: (this.auth.currentUser()?.firstName || '') + ' ' + (this.auth.currentUser()?.lastName || ''),
        email: this.auth.currentUser()?.email || '',
        contact: '+91' + String(this.addressForm.value.phone || '').trim().replace(/\s/g, '')
      },
      theme: {
        color: '#1a237e'
      },
      modal: {
        ondismiss: () => {
          this.orderProcessing.set(false);
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        this.orderProcessing.set(false);
        this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 4000 });
      });
      rzp.open();
    } catch (err: any) {
      this.orderProcessing.set(false);
      this.snackBar.open('Could not open payment window: ' + (err.message || 'Unknown error'), 'Close', { duration: 4000 });
    }
  }

  verifyAndPlaceOrder(paymentResponse: any): void {
    this.apiData.verifyRazorpayPayment({
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature
    }).subscribe({
      next: () => {
        this.placeOrderAfterPayment();
      },
      error: () => {
        this.orderProcessing.set(false);
        this.snackBar.open('Payment verification failed. Please contact support.', 'Close', { duration: 4000 });
      }
    });
  }

  placeOrderAfterPayment(): void {
    const items = this.checkoutItems().map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity
    }));

    const orderData = {
      items: items,
      shippingAddress: this.addressForm.value,
      paymentMethod: 'RAZORPAY',
      couponCode: this.appliedCoupon()
    };

    this.apiData.placeOrder(orderData).subscribe({
      next: (order) => {
        this.orderId.set(order.orderNumber);
        this.placedOrder.set(order);
        this.orderComplete.set(true);
        this.orderProcessing.set(false);
        if (!this.buyNowItem()) {
          this.cart.clearCart();
        }
        this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.orderProcessing.set(false);
        this.snackBar.open(err.error?.message || 'Failed to place order', 'Close', { duration: 3000 });
      }
    });
  }

  viewOrders(): void {
    this.router.navigate(['/customer/orders']);
  }
}
