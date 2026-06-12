import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = signal(true);
  selectedRole = signal<'customer' | 'vendor'>('customer');
  isLoading = signal(false);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  register(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    setTimeout(() => {
      const success = this.auth.register(this.form.value, this.selectedRole());

      if (success) {
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        const dashboardUrl = this.selectedRole() === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard';
        this.router.navigate([dashboardUrl]);
      }
      this.isLoading.set(false);
    }, 500);
  }

  setRole(role: 'customer' | 'vendor'): void {
    this.selectedRole.set(role);
  }
}
