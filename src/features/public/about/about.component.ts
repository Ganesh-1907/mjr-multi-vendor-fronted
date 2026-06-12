import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="about-page">
      <div class="hero">
        <h1>About MarketPlace</h1>
        <p>Your trusted multi-vendor e-commerce platform</p>
      </div>
      <div class="content">
        <mat-card>
          <mat-card-content>
            <h2>Our Mission</h2>
            <p>MarketPlace connects millions of buyers with verified sellers, offering a secure and convenient shopping experience. We believe in quality products, fair prices, and exceptional customer service.</p>

            <h2>What We Offer</h2>
            <div class="features">
              <div class="feature">
                <mat-icon>verified</mat-icon>
                <h3>Verified Sellers</h3>
                <p>All vendors undergo strict verification to ensure quality</p>
              </div>
              <div class="feature">
                <mat-icon>security</mat-icon>
                <h3>Secure Payments</h3>
                <p>Multiple payment options with bank-grade security</p>
              </div>
              <div class="feature">
                <mat-icon>support_agent</mat-icon>
                <h3>24/7 Support</h3>
                <p>Round-the-clock customer assistance</p>
              </div>
              <div class="feature">
                <mat-icon>assignment_return</mat-icon>
                <h3>Easy Returns</h3>
                <p>7-day hassle-free return policy</p>
              </div>
            </div>

            <h2>Contact Us</h2>
            <p>Have questions? Visit our <a routerLink="/contact">Contact Page</a> or email us at support&#64;marketplace.com</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .about-page { max-width: 900px; margin: 0 auto; padding: 24px; }
    .hero { text-align: center; padding: 48px 16px; background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; margin: -24px -24px 32px; }
    .hero h1 { font-size: 36px; margin-bottom: 8px; }
    .hero p { opacity: 0.9; }
    mat-card { padding: 8px; }
    mat-card-content { padding: 32px; }
    h2 { font-size: 24px; margin-bottom: 16px; color: #1a237e; }
    p { line-height: 1.8; color: #616161; margin-bottom: 24px; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin: 32px 0; }
    .feature { text-align: center; padding: 24px; background: #f5f5f5; border-radius: 12px; }
    .feature mat-icon { font-size: 48px; color: #1a237e; margin-bottom: 12px; }
    .feature h3 { font-size: 18px; margin-bottom: 8px; }
    .feature p { font-size: 14px; margin: 0; }
    a { color: #1a237e; }
  `]
})
export class AboutComponent {}
