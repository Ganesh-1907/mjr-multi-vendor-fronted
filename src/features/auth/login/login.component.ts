import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule as NgCommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgCommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
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

  returnMessage = signal('Test accounts - Customer: john.doe@email.com/password123 | Vendor: techstore@vendor.com/vendor123 | Admin: admin@marketplace.com/admin123');

  login(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    setTimeout(() => {
      const success = this.auth.login(
        this.form.value.email,
        this.form.value.password,
        this.selectedRole()
      );

      if (success) {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDashboardUrl();
        this.router.navigateByUrl(returnUrl);
      } else {
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
      }
      this.isLoading.set(false);
    }, 500);
  }

  setRole(role: 'customer' | 'vendor' | 'admin'): void {
    this.selectedRole.set(role);
  }

  private getDashboardUrl(): string {
    switch (this.selectedRole()) {
      case 'admin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/customer/dashboard';
    }
  }
}
