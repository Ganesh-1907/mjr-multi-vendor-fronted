export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
  vendorId: string;
  vendorName: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface OrderTracking {
  status: OrderStatus;
  timestamp: Date;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  status: OrderStatus;
  tracking: OrderTracking[];
  notes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  itemId: string;
  reason: string;
  description: string;
  status: 'requested' | 'approved' | 'rejected' | 'picked_up' | 'refunded';
  requestedAt: Date;
  processedAt?: Date;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  userId: string;
  userRole: 'customer' | 'support' | 'admin';
  message: string;
  createdAt: Date;
}
