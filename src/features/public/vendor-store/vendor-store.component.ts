import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from '../../../core/services/data.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Vendor, Product } from '../../../core/models';

@Component({
  selector: 'app-vendor-store',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatDividerModule, ProductCardComponent],
  template: `
    @if (vendor) {
      <div class="vendor-store-page">
        <div class="vendor-banner" [style.backgroundImage]="'url(' + (vendor.storeBanner || '') + ')'">
          <div class="overlay">
            <div class="vendor-info">
              <img [src]="vendor.storeLogo" [alt]="vendor.storeName" class="store-logo">
              <h1>{{vendor.storeName}}</h1>
              <p>{{vendor.storeDescription}}</p>
              <div class="vendor-stats">
                <span><mat-icon>inventory_2</mat-icon> {{vendor.totalProducts}} Products</span>
                <span><mat-icon>star</mat-icon> {{vendor.rating | number:'1.1-1'}} Rating</span>
                <span><mat-icon>sell</mat-icon> {{vendor.totalSales}} Sales</span>
                @if (vendor.isVerified) {
                  <span class="verified"><mat-icon>verified</mat-icon> Verified Seller</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="products-section">
          <h2>Products from {{vendor.storeName}}</h2>
          @if (products.length > 0) {
            <div class="products-grid">
              @for (product of products; track product.id) {
                <app-product-card [product]="product"></app-product-card>
              }
            </div>
          } @else {
            <p class="no-products">No products available from this vendor.</p>
          }
        </div>
      </div>
    } @else {
      <div class="not-found">
        <mat-icon>store</mat-icon>
        <h2>Vendor Not Found</h2>
        <p>The vendor you're looking for doesn't exist.</p>
        <button mat-raised-button color="primary" routerLink="/">Go Home</button>
      </div>
    }
  `,
  styles: [`
    .vendor-store-page { max-width: 1400px; margin: 0 auto; }
    .vendor-banner { height: 300px; background-size: cover; background-position: center; position: relative; }
    .overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(26,35,126,0.9) 0%, rgba(26,35,126,0.6) 100%); display: flex; align-items: center; padding: 24px 48px; }
    .vendor-info { color: white; max-width: 600px; }
    .store-logo { width: 80px; height: 80px; border-radius: 12px; margin-bottom: 16px; object-fit: cover; }
    .vendor-info h1 { font-size: 28px; margin-bottom: 8px; }
    .vendor-info p { opacity: 0.9; margin-bottom: 16px; }
    .vendor-stats { display: flex; flex-wrap: wrap; gap: 16px; }
    .vendor-stats span { display: flex; align-items: center; gap: 4px; font-size: 14px; }
    .vendor-stats mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .verified { color: #8bc34a; }
    .products-section { padding: 32px 24px; }
    .products-section h2 { font-size: 24px; margin-bottom: 24px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .no-products { text-align: center; color: #757575; padding: 48px; }
    .not-found { text-align: center; padding: 80px 24px; }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: #bdbdbd; margin-bottom: 16px; }
    @media (max-width: 768px) { .overlay { padding: 16px; } .vendor-banner { height: auto; } .vendor-info { padding: 24px; } .vendor-stats { gap: 12px; } }
  `]
})
export class VendorStoreComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  vendor: Vendor | undefined;
  products: Product[] = [];

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vendor = this.dataService.getVendorById(id);
      if (this.vendor) {
        this.products = this.dataService.getProductsByVendor(this.vendor.id);
      }
    }
  }
}
