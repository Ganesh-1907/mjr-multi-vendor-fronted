import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiDataService, Coupon } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="offers-page">
      <div class="hero">
        <span class="tag">Exclusive Deals</span>
        <h1>Discount Codes & Coupons</h1>
        <p>Apply these promo codes during checkout to unlock special discounts and benefits</p>
      </div>

      <div class="content-container">
        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading available offers...</p>
          </div>
        } @else {
          <div class="offers-grid">
            @for (coupon of coupons(); track coupon.code) {
              <div class="coupon-card" (click)="copyCouponCode(coupon.code)">
                <div class="card-left">
                  <div class="icon-circle">
                    <mat-icon>{{coupon.icon}}</mat-icon>
                  </div>
                  <div class="coupon-badge">{{coupon.type === 'PERCENTAGE' ? 'PERCENT' : 'FIXED'}}</div>
                </div>
                <div class="card-body">
                  <div class="coupon-title">{{coupon.title}}</div>
                  <div class="coupon-description">{{coupon.description}}</div>
                  <div class="coupon-meta">
                    <span class="meta-item">
                      <mat-icon>shopping_bag</mat-icon> Min spend: INR {{coupon.minOrderAmount}}
                    </span>
                    @if (coupon.maxDiscountAmount) {
                      <span class="meta-item">
                        <mat-icon>arrow_upward</mat-icon> Max Discount: INR {{coupon.maxDiscountAmount}}
                      </span>
                    }
                    <span class="meta-item expiry">
                      <mat-icon>event</mat-icon> Valid until: {{coupon.validUntil | date:'mediumDate'}}
                    </span>
                  </div>
                </div>
                <div class="card-right">
                  <div class="coupon-divider"></div>
                  <div class="code-wrapper">
                    <span class="label">Promo Code</span>
                    <div class="code-badge">{{coupon.code}}</div>
                    <button mat-flat-button color="primary" class="copy-btn">
                      <mat-icon>content_copy</mat-icon> Copy Code
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <mat-icon>sentiment_dissatisfied</mat-icon>
                <h3>No coupons available right now</h3>
                <p>Check back later for exciting offers and promotions.</p>
                <a mat-flat-button color="primary" routerLink="/products">Continue Shopping</a>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .offers-page {
      padding-bottom: 60px;
    }
    
    .hero {
      text-align: center;
      padding: 64px 24px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
        z-index: 1;
      }

      .tag {
        background: var(--primary, #3f51b5);
        color: white;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: inline-block;
        margin-bottom: 16px;
        position: relative;
        z-index: 2;
      }

      h1 {
        font-size: 38px;
        font-weight: 800;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
        position: relative;
        z-index: 2;
        color: #ffffff !important;
      }

      p {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9) !important;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
        position: relative;
        z-index: 2;
      }
    }

    .content-container {
      width: 100%;
      max-width: 1800px;
      margin: 40px auto 0;
      padding: 0 24px 48px;
      box-sizing: border-box;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      color: var(--text-secondary, #64748b);
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top-color: var(--primary, #3f51b5);
        border-radius: 50%;
        animation: spin 1s infinite linear;
        margin-bottom: 16px;
      }
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .offers-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .coupon-card {
      background: var(--bg-secondary, #ffffff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 16px;
      display: flex;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        border-color: var(--primary, #3f51b5);
      }

      .card-left {
        background: rgba(63, 81, 181, 0.04);
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        border-right: 1px dashed var(--border-color, #e2e8f0);
        min-width: 120px;

        .icon-circle {
          background: rgba(63, 81, 181, 0.1);
          color: var(--primary, #3f51b5);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 28px;
            width: 28px;
            height: 28px;
          }
        }

        .coupon-badge {
          background: var(--primary, #3f51b5);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
      }

      .card-body {
        flex: 1;
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .coupon-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary, #0f172a);
          margin-bottom: 8px;
        }

        .coupon-description {
          font-size: 14px;
          color: var(--text-secondary, #64748b);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .coupon-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12.5px;
            font-weight: 600;
            color: var(--text-secondary, #64748b);

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }

            &.expiry {
              color: #16a34a;
            }
          }
        }
      }

      .card-right {
        display: flex;
        align-items: center;
        padding: 32px 32px 32px 16px;

        .coupon-divider {
          height: 80px;
          border-left: 2px dashed var(--border-color, #e2e8f0);
          margin-right: 32px;
        }

        .code-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-secondary, #64748b);
            letter-spacing: 0.5px;
          }

          .code-badge {
            font-family: monospace;
            background: var(--bg-tertiary, #f1f5f9);
            border: 1px solid var(--border-color, #e2e8f0);
            color: var(--text-primary, #0f172a);
            font-weight: 800;
            font-size: 16px;
            padding: 8px 16px;
            border-radius: 8px;
            letter-spacing: 1px;
          }

          .copy-btn {
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 16px !important;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            
            mat-icon {
              font-size: 15px;
              width: 15px;
              height: 15px;
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: var(--bg-secondary, #ffffff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 16px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--text-secondary, #64748b);
        margin-bottom: 16px;
      }

      h3 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary, #64748b);
        margin-bottom: 24px;
      }

      a {
        border-radius: 9999px;
        padding: 8px 24px !important;
        font-weight: 600;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .coupon-card {
        flex-direction: column;

        .card-left {
          flex-direction: row;
          padding: 20px 24px;
          border-right: none;
          border-bottom: 1px dashed var(--border-color, #e2e8f0);
          justify-content: flex-start;
          gap: 16px;
        }

        .card-body {
          padding: 24px;
        }

        .card-right {
          padding: 24px;
          border-top: 1px solid var(--border-color, #e2e8f0);
          justify-content: center;

          .coupon-divider {
            display: none;
          }

          .code-wrapper {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }
  `]
})
export class OffersComponent implements OnInit {
  private apiData = inject(ApiDataService);
  private snackBar = inject(MatSnackBar);

  coupons = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.apiData.getActiveCoupons().subscribe({
      next: (data: Coupon[]) => {
        if (data && data.length > 0) {
          const mapped = data.map((c: Coupon) => {
            let title = '';
            if (c.type === 'PERCENTAGE') {
              title = `${c.value}% OFF Discount`;
            } else {
              title = `Flat INR ${c.value} Discount`;
            }
            return {
              ...c,
              title: title,
              description: c.description || `Valid until ${new Date(c.validUntil).toLocaleDateString()}. Min spend: INR ${c.minOrderAmount || 0}`,
              icon: c.type === 'PERCENTAGE' ? 'percent' : 'local_offer'
            };
          });
          this.coupons.set(mapped);
        } else {
          // fall back to default coupons
          this.coupons.set([
            {
              code: 'WELCOME10',
              title: '10% OFF Welcome Bonus',
              description: 'Get 10% off on your first order. Minimum order value is INR 500.',
              type: 'PERCENTAGE',
              value: 10,
              minOrderAmount: 500,
              maxDiscountAmount: 200,
              validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
              icon: 'redeem'
            },
            {
              code: 'FLAT200',
              title: 'Flat INR 200 Discount',
              description: 'Flat INR 200 off on purchases above INR 1,500.',
              type: 'FIXED',
              value: 200,
              minOrderAmount: 1500,
              validUntil: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
              icon: 'local_offer'
            },
            {
              code: 'MEGA20',
              title: '20% OFF Mega Sale',
              description: 'Save big with 20% off on orders of INR 2,500 or more.',
              type: 'PERCENTAGE',
              value: 20,
              minOrderAmount: 2500,
              maxDiscountAmount: 1000,
              validUntil: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
              icon: 'celebration'
            },
            {
              code: 'GANE1907',
              title: '30% OFF Special Discount',
              description: 'Save 30% on orders of INR 2,000 or more.',
              type: 'PERCENTAGE',
              value: 30,
              minOrderAmount: 2000,
              maxDiscountAmount: 10000,
              validUntil: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
              icon: 'percent'
            }
          ]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback on error
        this.coupons.set([
          {
            code: 'WELCOME10',
            title: '10% OFF Welcome Bonus',
            description: 'Get 10% off on your first order. Minimum order value is INR 500.',
            type: 'PERCENTAGE',
            value: 10,
            minOrderAmount: 500,
            maxDiscountAmount: 200,
            validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            icon: 'redeem'
          },
          {
            code: 'FLAT200',
            title: 'Flat INR 200 Discount',
            description: 'Flat INR 200 off on purchases above INR 1,500.',
            type: 'FIXED',
            value: 200,
            minOrderAmount: 1500,
            validUntil: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
            icon: 'local_offer'
          },
          {
            code: 'MEGA20',
            title: '20% OFF Mega Sale',
            description: 'Save big with 20% off on orders of INR 2,500 or more.',
            type: 'PERCENTAGE',
            value: 20,
            minOrderAmount: 2500,
            maxDiscountAmount: 1000,
            validUntil: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
            icon: 'celebration'
          },
          {
            code: 'GANE1907',
            title: '30% OFF Special Discount',
            description: 'Save 30% on orders of INR 2,000 or more.',
            type: 'PERCENTAGE',
            value: 30,
            minOrderAmount: 2000,
            maxDiscountAmount: 10000,
            validUntil: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
            icon: 'percent'
          }
        ]);
        this.isLoading.set(false);
      }
    });
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
}
