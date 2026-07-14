import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  stockQuantity?: number;
  attributes: { [key: string]: string };
}

export interface Product {
  id: number;
  vendorId: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: { [key: string]: string };
  tags: string[];
  rating: number;
  totalReviews: number;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  category?: { id: number; name: string; slug: string };
  vendor?: { id: number; storeName: string; storeSlug: string };
}

export interface ProductPreview {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  vendorName: string;
  categoryName: string;
  primaryImageUrl: string;
  primaryVariantPrice: number;
  primaryVariantComparePrice?: number;
  discountPercent: number;
  primaryVariantId: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  parentId?: number;
  isActive: boolean;
  productCount?: number;
}

export interface Vendor {
  id: number;
  userId: number;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogoUrl?: string;
  storeBannerUrl?: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  isVerified: boolean;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  buttonText?: string;
  position: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  description?: string;
}

export interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Order {
  id: number;
  _id?: string | number;
  orderNumber: string;
  userId: number;
  customerName?: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentTransactionId?: string;
  shippingFullName?: string;
  shippingPhone?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  items: OrderItem[];
  tracking: OrderTracking[];
  shippingAddress?: any;
  createdAt: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImageUrl: string;
  variantId: number;
  variantName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTracking {
  id: number;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiDataService {
  private api = inject(ApiService);

  getAdminCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('/admin/categories');
  }

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories');
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.api.get<Category>(`/categories/${slug}`);
  }

  getProducts(filters?: { category?: string; vendor?: string; minPrice?: string; maxPrice?: string; sort?: string; page?: number; size?: number; search?: string; minRating?: string }): Observable<ProductPreview[]> {
    return this.api.get<any>('/products', filters)
      .pipe(map(res => res.products || res));
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.api.get<Product>(`/products/${slug}`).pipe(
      map(prod => this.mapProductStock(prod))
    );
  }

  getFeaturedProducts(): Observable<ProductPreview[]> {
    return this.api.get<ProductPreview[]>('/products/featured');
  }

  getTrendingProducts(): Observable<ProductPreview[]> {
    return this.api.get<ProductPreview[]>('/products/trending');
  }

  getProductsByCategory(categorySlug: string): Observable<ProductPreview[]> {
    return this.api.get<any>(`/categories/${categorySlug}/products`)
      .pipe(map(res => res.products || res));
  }

  getProductsByVendor(vendorId: any): Observable<ProductPreview[]> {
    return this.api.get<any>(`/vendors/${vendorId}/products`)
      .pipe(map(res => res.products || res));
  }

  getRelatedProducts(productId: number): Observable<ProductPreview[]> {
    return this.api.get<ProductPreview[]>(`/products/${productId}/related`);
  }

  getReviewsForProduct(productId: number): Observable<Review[]> {
    return this.api.get<Review[]>(`/products/${productId}/reviews`);
  }

  addReview(productId: number, review: { rating: number; title: string; comment: string }): Observable<Review> {
    return this.api.post<Review>(`/products/${productId}/reviews`, review);
  }

  getVendors(): Observable<Vendor[]> {
    return this.api.get<Vendor[]>('/vendors');
  }

  getVendorById(id: number): Observable<Vendor> {
    return this.api.get<Vendor>(`/vendors/${id}`);
  }

  getVendorBySlug(slug: string): Observable<Vendor> {
    return this.api.get<Vendor>(`/vendors/${slug}`);
  }

  getBanners(): Observable<Banner[]> {
    return this.api.get<Banner[]>('/banners');
  }

  validateCoupon(code: string, amount: number): Observable<{ coupon: Coupon; discountAmount: number; finalAmount: number }> {
    return this.api.get<{ coupon: Coupon; discountAmount: number; finalAmount: number }>('/public/coupons/validate', { code, amount: amount.toString() });
  }

  getActiveCoupons(): Observable<Coupon[]> {
    return this.api.get<Coupon[]>('/public/coupons');
  }

  getOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('/orders');
  }

  getOrderById(id: number): Observable<Order> {
    return this.api.get<Order>(`/orders/${id}`);
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.api.get<Order[]>('/orders');
  }

  placeOrder(orderData: any): Observable<Order> {
    return this.api.post<Order>('/orders', orderData);
  }

  createRazorpayOrder(amount: number): Observable<any> {
    return this.api.post<any>('/payment/create-order', { amount, currency: 'INR' });
  }

  verifyRazorpayPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Observable<any> {
    return this.api.post<any>('/payment/verify', data);
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.api.post<Order>(`/orders/${orderId}/cancel`, {});
  }

  getOrderTracking(orderId: number): Observable<OrderTracking[]> {
    return this.api.get<OrderTracking[]>(`/orders/${orderId}/tracking`);
  }

  getVendorOrders(vendorId: number): Observable<Order[]> {
    return this.api.get<Order[]>('/vendor/orders');
  }

  getVendorProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/vendor/products').pipe(
      map(prods => prods.map(p => this.mapProductStock(p)))
    );
  }

  createProduct(productData: any): Observable<Product> {
    return this.api.post<Product>('/vendor/products', productData).pipe(
      map(prod => this.mapProductStock(prod))
    );
  }

  updateProduct(productId: number, productData: any): Observable<Product> {
    return this.api.put<Product>(`/vendor/products/${productId}`, productData).pipe(
      map(prod => this.mapProductStock(prod))
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.api.delete<void>(`/vendor/products/${productId}`);
  }

  getVendorReviews(): Observable<Review[]> {
    return this.api.get<Review[]>('/vendor/reviews');
  }

  getVendorAnalytics(): Observable<any> {
    return this.api.get<any>('/vendor/analytics');
  }

  getAdminDashboard(): Observable<any> {
    return this.api.get<any>('/admin/dashboard');
  }

  getAdminOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('/admin/orders');
  }

  updateAdminOrderStatus(orderId: number, status: string, description?: string, location?: string): Observable<Order> {
    return this.api.put<Order>(`/admin/orders/${orderId}/status`, { status, description, location });
  }

  updateVendorOrderStatus(orderId: number, status: string, description?: string, location?: string): Observable<Order> {
    return this.api.put<Order>(`/vendor/orders/${orderId}/status`, { status, description, location });
  }

  getAdminUsers(): Observable<any[]> {
    return this.api.get<any[]>('/admin/users');
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<void> {
    return this.api.put<void>(`/admin/users/${userId}/status`, { isActive });
  }

  getAdminVendors(): Observable<Vendor[]> {
    return this.api.get<Vendor[]>('/admin/vendors');
  }

  getPendingVendors(): Observable<Vendor[]> {
    return this.api.get<Vendor[]>('/admin/vendors/pending');
  }

  approveVendor(vendorId: number): Observable<Vendor> {
    return this.api.put<Vendor>(`/admin/vendors/${vendorId}/approve`, {});
  }

  rejectVendor(vendorId: number, reason: string): Observable<Vendor> {
    return this.api.put<Vendor>(`/admin/vendors/${vendorId}/reject`, { reason });
  }

  createVendor(vendorData: { email: string; storeName: string; firstName: string; lastName: string; phone: string }): Observable<any> {
    return this.api.post<any>('/admin/vendors/create', vendorData);
  }

  createCategory(categoryData: any): Observable<Category> {
    return this.api.post<Category>('/admin/categories', categoryData);
  }

  updateCategory(id: number, categoryData: any): Observable<Category> {
    return this.api.put<Category>(`/admin/categories/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/categories/${id}`);
  }

  getAdminProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/admin/products');
  }

  createAdminProduct(productData: any): Observable<Product> {
    return this.api.post<Product>('/admin/products', productData);
  }

  updateAdminProduct(id: number, productData: any): Observable<Product> {
    return this.api.put<Product>(`/admin/products/${id}`, productData);
  }

  deleteAdminProduct(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/products/${id}`);
  }

  getPendingProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/admin/products/pending');
  }

  approveProduct(productId: number): Observable<Product> {
    return this.api.put<Product>(`/admin/products/${productId}/approve`, {});
  }

  rejectProduct(productId: number): Observable<Product> {
    return this.api.put<Product>(`/admin/products/${productId}/reject`, {});
  }


  getProfile(): Observable<any> {
    return this.api.get<any>('/profile');
  }

  updateProfile(data: any): Observable<any> {
    return this.api.put<any>('/profile', data);
  }

  getAddresses(): Observable<any[]> {
    return this.api.get<any[]>('/addresses');
  }

  addAddress(data: any): Observable<any> {
    return this.api.post<any>('/addresses', data);
  }

  updateAddress(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/addresses/${id}`, data);
  }

  deleteAddress(id: number): Observable<void> {
    return this.api.delete<void>(`/addresses/${id}`);
  }

  getNotifications(): Observable<any[]> {
    return this.api.get<any[]>('/notifications');
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.api.get<number>('/notifications/unread-count');
  }

  markNotificationRead(id: number): Observable<void> {
    return this.api.put<void>(`/notifications/${id}/read`, {});
  }

  markAllNotificationsRead(): Observable<void> {
    return this.api.put<void>('/notifications/read-all', {});
  }

  createTicket(data: { subject: string; message: string; priority?: string; orderId?: number }): Observable<any> {
    return this.api.post<any>('/support/tickets', data);
  }

  getTickets(): Observable<any[]> {
    return this.api.get<any[]>('/support/tickets');
  }

  getTicketById(id: number): Observable<any> {
    return this.api.get<any>(`/support/tickets/${id}`);
  }

  addTicketResponse(ticketId: number, message: string): Observable<any> {
    return this.api.post<any>(`/support/tickets/${ticketId}/responses`, { message });
  }

  getHomeData(): Observable<{
    featuredProducts: ProductPreview[];
    trendingProducts: ProductPreview[];
    banners: Banner[];
    categories: Category[];
  }> {
    return this.api.get<any>('/public/home');
  }

  searchProducts(query: string): Observable<ProductPreview[]> {
    return this.api.get<ProductPreview[]>('/public/search', { q: query });
  }

  submitContactInquiry(data: any): Observable<any> {
    return this.api.post<any>('/public/contact', data);
  }

  getContactInquiries(): Observable<any[]> {
    return this.api.get<any[]>('/admin/contacts');
  }

  deleteContactInquiry(id: number): Observable<any> {
    return this.api.delete<any>(`/admin/contacts/${id}`);
  }

  mapProductStock(prod: Product): Product {
    if (prod && prod.variants) {
      prod.variants = prod.variants.map(v => ({
        ...v,
        stock: v.stockQuantity ?? v.stock ?? 0
      }));
    }
    return prod;
  }
}
