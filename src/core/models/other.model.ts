export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'promotion' | 'system' | 'review' | 'refund' | 'product';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'order' | 'product' | 'payment' | 'shipping' | 'return' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  product: ProductPreview;
  addedAt: Date;
}

export interface ProductPreview {
  id: string;
  name: string;
  image: string;
  price: number;
  vendorName: string;
  rating: number;
  inStock: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validTill: Date;
  status: 'active' | 'inactive' | 'expired';
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  position: 'home_slider' | 'home_banner' | 'category_banner' | 'sidebar';
  order: number;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
}

export interface Analytics {
  revenue: RevenueData;
  orders: OrderData;
  products: ProductData;
  customers: CustomerData;
}

export interface RevenueData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  chart: ChartData[];
}

export interface OrderData {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  chart: ChartData[];
}

export interface ProductData {
  total: number;
  active: number;
  outOfStock: number;
  topSelling: TopProduct[];
}

export interface CustomerData {
  total: number;
  newThisMonth: number;
  chart: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
}
