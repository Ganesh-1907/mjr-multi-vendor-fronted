import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'vendor') {
        this.setRole('vendor');
      } else if (params['role'] === 'customer') {
        this.setRole('customer');
      }
    });
  }

  hidePassword = signal(true);
  selectedRole = signal<'customer' | 'vendor'>('customer');
  isLoading = signal(false);
  otpSent = signal(false);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    storeName: [''],
    otp: ['']
  });

  setRole(role: 'customer' | 'vendor'): void {
    this.selectedRole.set(role);
    if (role === 'vendor') {
      this.form.get('storeName')?.setValidators(Validators.required);
    } else {
      this.form.get('storeName')?.clearValidators();
    }
    this.form.get('storeName')?.updateValueAndValidity();
  }

  sendOtp(): void {
    if (this.form.get('email')?.invalid) {
      this.snackBar.open('Please enter a valid email', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);
    this.auth.sendOtp(this.form.value.email, this.selectedRole())
      .then(() => {
        this.otpSent.set(true);
        this.snackBar.open('OTP sent to your email', 'Close', { duration: 3000 });
        this.form.get('otp')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('otp')?.updateValueAndValidity();
        this.isLoading.set(false);
      })
      .catch(err => {
        this.snackBar.open(err, 'Close', { duration: 4000 });
        this.isLoading.set(false);
      });
  }

  register(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.value;

    const registerData: any = {
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      role: this.selectedRole(),
      otp: formValue.otp
    };

    if (this.selectedRole() === 'vendor') {
      registerData.storeName = formValue.storeName;
    }

    this.auth.register(registerData)
      .then((user) => {
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        const dashboardUrl = user.role === 'VENDOR' ? '/vendor/dashboard' : '/customer/dashboard';
        this.router.navigate([dashboardUrl]);
        this.isLoading.set(false);
      })
      .catch(err => {
        const msg = err.toString();
        if (msg.includes('VENDOR_PENDING_APPROVAL')) {
          this.snackBar.open(msg.replace('VENDOR_PENDING_APPROVAL: ', ''), 'Close', { duration: 8000 });
          this.router.navigate(['/']);
        } else {
          this.snackBar.open(msg, 'Close', { duration: 4000 });
        }
        this.isLoading.set(false);
      });
  }
}
