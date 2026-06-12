import { UserRole } from './user.model';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  image?: string;
  attributes: { [key: string]: string };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText?: string;
  position: 'home_hero' | 'home_promo' | 'category' | 'sidebar';
  isActive: boolean;
  sortOrder: number;
  startDate: Date;
  endDate: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}
