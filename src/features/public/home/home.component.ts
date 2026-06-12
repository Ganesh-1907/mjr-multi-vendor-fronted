import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../../core/services/data.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Product, Category, Banner } from '../../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private dataService = inject(DataService);

  banners: Banner[] = this.dataService.getBanners();
  categories: Category[] = this.dataService.getCategories().slice(0, 8);
  featuredProducts: Product[] = this.dataService.getFeaturedProducts().slice(0, 8);
  trendingProducts: Product[] = this.dataService.getTrendingProducts().slice(0, 4);

  currentBanner = 0;

  nextBanner(): void {
    this.currentBanner = (this.currentBanner + 1) % this.banners.length;
  }

  prevBanner(): void {
    this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length;
  }

  selectBanner(index: number): void {
    this.currentBanner = index;
  }
}
