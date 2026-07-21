import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiDataService, ProductPreview, Category, Banner } from '../../../core/services/api-data.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    ProductCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private apiData = inject(ApiDataService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  banners = signal<Banner[]>([]);
  heroBanners = computed(() => this.banners().filter(b => b.position === 'HOME_HERO' || !b.position));
  promoBanners = computed(() => this.banners().filter(b => b.position === 'HOME_PROMO'));
  categories = signal<Category[]>([]);
  featuredProducts = signal<ProductPreview[]>([]);
  trendingProducts = signal<ProductPreview[]>([]);
  isLoading = signal(true);
  currentBanner = 0;
  categoryOffset = 0;
  couponOffset = 0;

  private autoplayIntervalId: any = null;
  private categoryAutoplayId: any = null;

  private viewportItemsPerView = 4;
  private viewportCouponsPerView = 3;

  // Active coupons list for the Offers Section
  coupons = signal<any[]>([]);

  couponsPerView = computed(() => {
    if (this.coupons().length <= 1) return 1;
    if (this.coupons().length <= 2) return this.coupons().length;
    return this.viewportCouponsPerView;
  });

  maxCouponOffset = computed(() => {
    return Math.max(0, this.coupons().length - this.couponsPerView());
  });

  couponCurrentDot = computed(() => {
    return Math.min(this.couponOffset, this.maxCouponOffset());
  });

  couponDots = computed(() => {
    const len = this.maxCouponOffset() + 1;
    return Array.from({ length: len }, (_, i) => i);
  });

  itemsPerView = computed(() => {
    if (this.categories().length <= 1) return 1;
    if (this.categories().length <= 2) return this.categories().length;
    return this.viewportItemsPerView;
  });

  maxCategoryOffset = computed(() => {
    return Math.max(0, this.categories().length - this.itemsPerView());
  });

  categoryCurrentDot = computed(() => {
    return Math.min(this.categoryOffset, this.maxCategoryOffset());
  });

  categoryDots = computed(() => {
    const len = this.maxCategoryOffset() + 1;
    return Array.from({ length: len }, (_, i) => i);
  });

  @HostListener('window:resize')
  onResize(): void {
    this.recalcItemsPerView();
  }

  ngOnInit(): void {
    this.apiData.getHomeData().subscribe({
      next: (data: any) => {
        const rawBanners = data.banners || data.activeBanners || [];
        const rawCategories = data.categories || data.activeCategories || [];
        this.banners.set(rawBanners);
        this.categories.set(rawCategories);
        this.featuredProducts.set(data.featuredProducts || []);
        this.trendingProducts.set(data.trendingProducts || []);

        if (data.coupons && data.coupons.length > 0) {
          const mappedCoupons = data.coupons.map((c: any) => {
            let title = '';
            if (c.type === 'PERCENTAGE') {
              title = `${c.value}% OFF Discount`;
            } else {
              title = `Flat INR ${c.value} Discount`;
            }
            return {
              code: c.code,
              title: title,
              description: c.description || `Valid until ${new Date(c.validUntil).toLocaleDateString()}. Min spend: INR ${c.minOrderAmount || 0}`,
              icon: c.type === 'PERCENTAGE' ? 'percent' : 'local_offer'
            };
          });
          this.coupons.set(mappedCoupons);
        } else {
          this.coupons.set([
            {
              code: 'WELCOME10',
              title: '10% OFF Welcome Bonus',
              description: 'Get 10% off on your first order. Minimum order value is INR 500.',
              icon: 'redeem'
            },
            {
              code: 'FLAT200',
              title: 'Flat INR 200 Discount',
              description: 'Flat INR 200 off on purchases above INR 1,500.',
              icon: 'local_offer'
            },
            {
              code: 'MEGA20',
              title: '20% OFF Mega Sale',
              description: 'Save big with 20% off on orders of INR 2,500 or more.',
              icon: 'celebration'
            }
          ]);
        }

        this.isLoading.set(false);
        this.recalcItemsPerView();
        this.startAutoplay();
        this.startCategoryAutoplay();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.stopCategoryAutoplay();
  }

  recalcItemsPerView(): void {
    const width = window.innerWidth;
    if (width <= 640) {
      this.viewportItemsPerView = 1;
      this.viewportCouponsPerView = 1;
    } else if (width <= 900) {
      this.viewportItemsPerView = 2;
      this.viewportCouponsPerView = 1;
    } else if (width <= 1200) {
      this.viewportItemsPerView = 3;
      this.viewportCouponsPerView = 2;
    } else {
      this.viewportItemsPerView = 4;
      this.viewportCouponsPerView = 3;
    }
  }

  startAutoplay(): void {
    this.stopAutoplay();
    if (this.heroBanners().length > 1) {
      this.autoplayIntervalId = setInterval(() => {
        this.nextBanner();
      }, 5000);
    }
  }

  stopAutoplay(): void {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
      this.autoplayIntervalId = null;
    }
  }

  startCategoryAutoplay(): void {
    this.stopCategoryAutoplay();
    if (this.categories().length > this.itemsPerView()) {
      this.categoryAutoplayId = setInterval(() => {
        this.nextCategory();
      }, 3000);
    }
  }

  stopCategoryAutoplay(): void {
    if (this.categoryAutoplayId) {
      clearInterval(this.categoryAutoplayId);
      this.categoryAutoplayId = null;
    }
  }

  nextBanner(): void {
    if (this.heroBanners().length === 0) return;
    this.currentBanner = (this.currentBanner + 1) % this.heroBanners().length;
  }

  prevBanner(): void {
    if (this.heroBanners().length === 0) return;
    this.currentBanner = (this.currentBanner - 1 + this.heroBanners().length) % this.heroBanners().length;
  }

  selectBanner(index: number): void {
    this.currentBanner = index;
    this.startAutoplay();
  }

  nextCategory(): void {
    if (this.categories().length === 0) return;
    const max = this.maxCategoryOffset();
    if (this.categoryOffset < max) {
      this.categoryOffset++;
    } else {
      this.categoryOffset = 0;
    }
  }

  prevCategory(): void {
    if (this.categories().length === 0) return;
    const max = this.maxCategoryOffset();
    if (this.categoryOffset > 0) {
      this.categoryOffset--;
    } else {
      this.categoryOffset = max;
    }
  }

  nextCoupon(): void {
    if (this.coupons().length === 0) return;
    const max = this.maxCouponOffset();
    if (this.couponOffset < max) {
      this.couponOffset++;
    } else {
      this.couponOffset = 0;
    }
  }

  prevCoupon(): void {
    if (this.coupons().length === 0) return;
    const max = this.maxCouponOffset();
    if (this.couponOffset > 0) {
      this.couponOffset--;
    } else {
      this.couponOffset = max;
    }
  }

  goToCoupon(index: number): void {
    this.couponOffset = index;
  }

  goToCategoryDot(index: number): void {
    this.categoryOffset = index;
    this.startCategoryAutoplay();
  }

  copyCouponCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.snackBar.open(`Coupon "${code}" copied to clipboard!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }).catch(() => {
      this.snackBar.open('Failed to copy coupon code.', 'Close', { duration: 3000 });
    });
  }

  navigate(url: string): void {
    if (!url) {
      url = '/products';
    }
    if (url.includes('?')) {
      const parts = url.split('?');
      const path = parts[0];
      const queryStr = parts[1];
      const queryParams: any = {};
      queryStr.split('&').forEach(param => {
        const [key, val] = param.split('=');
        if (key) queryParams[key] = val || '';
      });
      this.router.navigate([path], { queryParams });
    } else {
      this.router.navigate([url]);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  handleCategoryImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%23e2e8f0%27 width=%27400%27 height=%27300%27/%3E%3Ctext fill=%27%2394a3b8%27 font-family=%27sans-serif%27 font-size=%2718%27 text-anchor=%27middle%27 x=%27200%27 y=%27160%27%3ENo Image%3C/text%3E%3C/svg%3E';
    }
  }
}
