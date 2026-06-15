import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  storeName?: string;
  otp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private currentUserSignal = signal<AuthUser | null>(null);
  private isAuthenticatedSignal = signal(false);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  userRole = computed(() => this.currentUserSignal()?.role?.toLowerCase() ?? null);
  isAdmin = computed(() => this.userRole() === 'admin');
  isVendor = computed(() => this.userRole() === 'vendor');
  isCustomer = computed(() => this.userRole() === 'customer');

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    const token = localStorage.getItem('auth_token');
    if (stored && token) {
      try {
        const user = JSON.parse(stored) as AuthUser;
        user.token = token;
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch {
        this.clearStorage();
      }
    }
  }

  login(request: LoginRequest) {
    return new Promise<AuthUser>((resolve, reject) => {
      this.api.postRaw<AuthUser>('/auth/login', request).subscribe({
        next: (response) => {
          const user = response.data;
          localStorage.setItem('auth_token', user.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSignal.set(user);
          this.isAuthenticatedSignal.set(true);
          resolve(user);
        },
        error: (err) => reject(err.error?.message || err.message || 'Login failed')
      });
    });
  }

  sendOtp(email: string, role: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>('/auth/send-otp', { email, role }).subscribe({
        next: () => resolve(),
        error: (err) => reject(err.error?.message || 'Failed to send OTP')
      });
    });
  }

  resendOtp(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>('/auth/resend-otp', { email }).subscribe({
        next: () => resolve(),
        error: (err) => reject(err.error?.message || 'Failed to resend OTP')
      });
    });
  }

  register(request: RegisterRequest): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<AuthUser>('/auth/register', request).subscribe({
        next: (response) => {
          const user = response.data;
          localStorage.setItem('auth_token', user.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSignal.set(user);
          this.isAuthenticatedSignal.set(true);
          resolve(user);
        },
        error: (err) => reject(err.error?.message || 'Registration failed')
      });
    });
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/']);
  }

  forgotPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>('/auth/forgot-password', { email }).subscribe({
        next: () => resolve(),
        error: (err) => reject(err.error?.message || 'Failed to send reset OTP')
      });
    });
  }

  resetPassword(email: string, otp: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.postRaw<any>('/auth/reset-password', { email, otp, password }).subscribe({
        next: () => resolve(),
        error: (err) => reject(err.error?.message || 'Failed to reset password')
      });
    });
  }

  updateProfile(firstName: string, lastName: string, phone: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.putRaw<any>('/profile', { firstName, lastName, phone }).subscribe({
        next: () => {
          const current = this.currentUserSignal();
          if (current) {
            const updated = { ...current, firstName, lastName, phone };
            localStorage.setItem('currentUser', JSON.stringify(updated));
            this.currentUserSignal.set(updated);
          }
          resolve();
        },
        error: (err) => reject(err.error?.message || 'Failed to update profile')
      });
    });
  }

  private clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
  }
}
