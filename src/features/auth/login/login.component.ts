import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

export interface PendingAction {
  type: 'addToCart' | 'toggleWishlist';
  productId: number;
  variantId?: number;
  quantity?: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule, MatSnackBarModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private wishlist = inject(WishlistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal(true);
  selectedRole = signal<'customer' | 'vendor' | 'admin'>('customer');
  isLoading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  returnMessage = signal('Welcome to N-CommerceHub');

  ngOnInit(): void {
    const roleParam = this.route.snapshot.queryParams['role'];
    if (roleParam === 'customer' || roleParam === 'vendor' || roleParam === 'admin') {
      this.selectedRole.set(roleParam);
    }
  }

  login(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    this.auth.login({
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.selectedRole()
    })
      .then((user) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.cart.loadCart();
          this.wishlist.loadWishlist();
          this.executePendingAction().then(() => {
          const returnUrl = this.route.snapshot.queryParams['redirectTo']
            || this.route.snapshot.queryParams['returnUrl']
            || this.getDashboardUrl(user.role);
          this.router.navigateByUrl(returnUrl);
          this.isLoading.set(false);
        });
      })
      .catch(err => {
        let msg = err;
        if (err === 'VENDOR_PENDING_APPROVAL') {
          msg = 'Your vendor account is pending admin approval.';
        } else if (err === 'Account is deactivated. Contact support.') {
          msg = 'Your account has been blocked or rejected. Please contact support.';
        }
        this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isLoading.set(false);
      });
  }

  private executePendingAction(): Promise<void> {
    const raw = localStorage.getItem('pending_action');
    if (!raw) return Promise.resolve();

    localStorage.removeItem('pending_action');

    try {
      const action: PendingAction = JSON.parse(raw);
      if (action.type === 'addToCart' && action.productId && action.variantId) {
        return this.cart.addToCart(action.productId, action.variantId, action.quantity || 1)
          .then(() => {
            this.snackBar.open('Item added to cart!', 'Close', { duration: 2000 });
          });
      }
      if (action.type === 'toggleWishlist' && action.productId) {
        return this.wishlist.addToWishlist(action.productId)
          .then(() => {
            this.snackBar.open('Item added to wishlist!', 'Close', { duration: 2000 });
          });
      }
    } catch {}
    return Promise.resolve();
  }

  setRole(role: 'customer' | 'vendor' | 'admin'): void {
    this.selectedRole.set(role);
  }

  private getDashboardUrl(role: string): string {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'VENDOR': return '/vendor/dashboard';
      default: return '/customer/dashboard';
    }
  }
}
