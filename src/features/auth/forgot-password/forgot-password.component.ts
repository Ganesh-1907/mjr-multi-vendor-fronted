import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatSnackBarModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);

  emailSent = signal(false);
  isLoading = signal(false);
  resetSuccess = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  submitEmail(): void {
    if (this.emailForm.invalid) return;

    this.isLoading.set(true);
    const email = this.emailForm.value.email;

    this.authService.forgotPassword(email).then(() => {
      this.emailSent.set(true);
      this.isLoading.set(false);
      this.snackBar.open('OTP sent to your email successfully', 'Close', { duration: 4000 });
    }).catch((err) => {
      this.isLoading.set(false);
      this.snackBar.open(err || 'Failed to send OTP. Please check your email.', 'Close', { duration: 4000 });
    });
  }

  submitReset(): void {
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);
    const email = this.emailForm.value.email;
    const otp = this.resetForm.value.otp;
    const password = this.resetForm.value.password;

    this.authService.resetPassword(email, otp, password).then(() => {
      this.resetSuccess.set(true);
      this.isLoading.set(false);
      this.snackBar.open('Password reset successfully!', 'Close', { duration: 4000 });
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    }).catch((err) => {
      this.isLoading.set(false);
      this.snackBar.open(err || 'Failed to reset password. Please check your OTP.', 'Close', { duration: 4000 });
    });
  }
}
