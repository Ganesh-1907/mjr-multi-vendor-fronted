import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule],
  template: `
    <div class="about-page">
      <div class="hero">
        <h1>About N-CommerceHub</h1>
        <p>Your trusted multi-vendor e-commerce platform connecting creators, businesses, and customers worldwide.</p>
      </div>

      <div class="content">
        <!-- Brand Story / Mission Section -->
        <section class="story-section">
          <div class="story-text">
            <span class="section-tag">Our Story</span>
            <h2>Connecting Buyers and Sellers Globally</h2>
            <p>
              Founded with the vision to democratize e-commerce, N-CommerceHub is more than just a store. It is a vibrant ecosystem where independent vendors, local artisans, and international brands come together to offer a diverse range of products.
            </p>
            <p>
              Our mission is to establish a secure, seamless, and transparent shopping environment where quality meets fairness. By backing our merchants with advanced digital tools and giving buyers robust protection, we create mutual trust that powers community commerce.
            </p>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-number">10M+</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">15K+</span>
                <span class="stat-label">Verified Sellers</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">99.9%</span>
                <span class="stat-label">Secure Orders</span>
              </div>
            </div>
          </div>
          <div class="story-graphic">
            <img src="assets/images/about.png" alt="About us Story" class="story-img">
          </div>
        </section>

        <!-- Core Strengths / What We Offer -->
        <section class="strengths-section">
          <div class="section-header">
            <span class="section-tag">Our Strengths</span>
            <h2>Why Choose N-CommerceHub?</h2>
            <p>We build features that empower customers and support merchants at every stage.</p>
          </div>

          <div class="features-grid">
            <mat-card class="strength-card">
              <mat-card-content>
                <div class="icon-box">
                  <mat-icon>verified</mat-icon>
                </div>
                <h3>Verified Sellers</h3>
                <p>Every seller is thoroughly vetted to guarantee authentic products and reliable service.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="strength-card">
              <mat-card-content>
                <div class="icon-box">
                  <mat-icon>security</mat-icon>
                </div>
                <h3>Secure Transactions</h3>
                <p>Shop with confidence. We offer fully encrypted, bank-grade checkout integrations.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="strength-card">
              <mat-card-content>
                <div class="icon-box">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <h3>24/7 Support</h3>
                <p>Our dedicated support team is always online to resolve any issue or answer questions.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="strength-card">
              <mat-card-content>
                <div class="icon-box">
                  <mat-icon>assignment_return</mat-icon>
                </div>
                <h3>Hassle-Free Returns</h3>
                <p>Change your mind? Rest easy with our transparent, user-friendly 7-day return policy.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="cta-section">
          <div class="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Explore thousands of premium products from top-rated sellers today.</p>
            <div class="cta-actions">
              <a mat-flat-button color="primary" routerLink="/products" class="cta-btn primary">
                <mat-icon>shopping_bag</mat-icon> Browse Store
              </a>
              <a mat-stroked-button routerLink="/contact" class="cta-btn secondary">
                <mat-icon>email</mat-icon> Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 0;
      background: var(--bg-primary);
    }

    .hero {
      text-align: center;
      padding: 60px 24px;
      background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
      color: white;
      margin: 0 0 40px 0;
      box-shadow: var(--shadow-sm);
    }

    .hero h1 {
      font-size: 38px;
      font-weight: 800;
      margin-bottom: 12px;
      color: white !important;
      letter-spacing: -0.5px;
    }

    .hero p {
      opacity: 0.85;
      color: white !important;
      font-size: 16px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .content {
      width: 100%;
      max-width: 1800px;
      margin: 0 auto;
      padding: 0 24px 60px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 60px;
    }

    .section-tag {
      background: var(--primary-light);
      color: var(--primary);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-block;
      margin-bottom: 16px;
    }

    /* Story Section */
    .story-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 48px;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 48px;
      box-shadow: var(--shadow-sm);
    }

    .story-text h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--text-primary);
    }

    .story-text p {
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 32px;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .story-graphic {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .story-img {
      width: 100%;
      max-width: 450px;
      height: auto;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease;
    }
    .story-img:hover {
      transform: scale(1.02);
    }

    /* Strengths Section */
    .strengths-section {
      width: 100%;
    }

    .section-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .section-header h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .section-header p {
      font-size: 16px;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .strength-card {
      border: 1px solid var(--border-light) !important;
      box-shadow: var(--card-shadow) !important;
    }

    .strength-card mat-card-content {
      padding: 32px 24px !important;
      text-align: center;
    }

    .icon-box {
      width: 56px;
      height: 56px;
      background: var(--primary-light);
      color: var(--primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .icon-box mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .strength-card h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .strength-card p {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-lg);
      padding: 48px;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .cta-content {
      position: relative;
      z-index: 2;
    }

    .cta-section h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      color: white !important;
    }

    .cta-section p {
      font-size: 16px;
      opacity: 0.85;
      margin-bottom: 28px;
      color: white !important;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-btn {
      padding: 12px 28px !important;
      height: 48px;
      font-weight: 600;
      border-radius: var(--radius-md) !important;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .cta-btn.secondary {
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: white !important;
    }

    .cta-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: white !important;
    }

    @media (max-width: 1200px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 992px) {
      .story-section {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 32px;
      }
      .story-graphic {
        order: -1;
      }
    }

    @media (max-width: 600px) {
      .content {
        padding: 0 20px 40px;
      }
      .stats-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {}
