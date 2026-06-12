import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, Customer, Vendor, Admin } from '../models';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  userRole = computed(() => this.currentUserSignal()?.role ?? null);
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  isVendor = computed(() => this.currentUserSignal()?.role === 'vendor');
  isCustomer = computed(() => this.currentUserSignal()?.role === 'customer');

  constructor(private dataService: DataService, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string, role: 'customer' | 'vendor' | 'admin'): boolean {
    let user: User | undefined;

    if (role === 'customer') {
      user = this.dataService.getCustomers().find(c => c.email === email && c.password === password);
    } else if (role === 'vendor') {
      user = this.dataService.getVendors().find(v => v.email === email && v.password === password);
    } else if (role === 'admin') {
      user = this.dataService.getAdmins().find(a => a.email === email && a.password === password);
    }

    if (user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(userData: Partial<Customer> | Partial<Vendor>, role: 'customer' | 'vendor'): boolean {
    const id = `new_${Date.now()}`;

    if (role === 'customer') {
      const customer: Customer = {
        id,
        email: userData.email!,
        password: userData.password!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        phone: userData.phone!,
        role: 'customer',
        addresses: [],
        wishlist: [],
        cartItems: [],
        createdAt: new Date()
      };
      localStorage.setItem('currentUser', JSON.stringify(customer));
      this.currentUserSignal.set(customer);
      this.isAuthenticatedSignal.set(true);
    } else if (role === 'vendor') {
      const vendor: Vendor = {
        id,
        email: userData.email!,
        password: userData.password!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        phone: userData.phone!,
        role: 'vendor',
        storeName: '',
        storeDescription: '',
        businessEmail: userData.email!,
        businessPhone: userData.phone!,
        gstNumber: '',
        panNumber: '',
        bankAccountNo: '',
        bankIfsc: '',
        bankName: '',
        rating: 0,
        totalProducts: 0,
        totalSales: 0,
        isVerified: false,
        createdAt: new Date()
      };
      localStorage.setItem('currentUser', JSON.stringify(vendor));
      this.currentUserSignal.set(vendor);
      this.isAuthenticatedSignal.set(true);
    }
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  updateProfile(updates: Partial<User>): void {
    const current = this.currentUserSignal();
    if (current) {
      const updated = { ...current, ...updates } as User;
      this.currentUserSignal.set(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }
}
