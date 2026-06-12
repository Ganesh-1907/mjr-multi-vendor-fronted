export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'customer';
  addresses: Address[];
  wishlist: string[];
  cartItems: CartItem[];
  createdAt: Date;
}

export interface Vendor {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'vendor';
  storeName: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  businessEmail: string;
  businessPhone: string;
  gstNumber: string;
  panNumber: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankName: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  isVerified: boolean;
  createdAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'admin';
  permissions: string[];
  createdAt: Date;
}

export type User = Customer | Vendor | Admin;

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
