import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Product, Category } from '../../../core/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatExpansionModule, MatDividerModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  allProducts: Product[] = this.dataService.getProducts();
  categories: Category[] = this.dataService.getCategories();

  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  selectedSort = signal('featured');
  priceRange = signal<[number, number]>([0, 200000]);
  selectedRating = signal<number | null>(null);

  products = computed(() => {
    let filtered = [...this.allProducts];

    const categorySlug = this.route.snapshot.queryParams['category'];
    if (categorySlug) {
      const cat = this.dataService.getCategoryBySlug(categorySlug);
      if (cat) {
        filtered = filtered.filter(p => p.categoryId === cat.id);
      }
    }

    const search = this.searchQuery();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    const catId = this.selectedCategory();
    if (catId) {
      filtered = filtered.filter(p => p.categoryId === catId);
    }

    const [minPrice, maxPrice] = this.priceRange();
    if (minPrice > 0 || maxPrice < 200000) {
      filtered = filtered.filter(p => {
        const price = p.variants[0]?.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    const rating = this.selectedRating();
    if (rating) {
      filtered = filtered.filter(p => p.rating >= rating);
    }

    const sort = this.selectedSort();
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  });

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }

  selectCategory(catId: string | null): void {
    this.selectedCategory.set(catId);
  }

  setRating(rating: number | null): void {
    this.selectedRating.set(rating);
  }

  setSort(sort: string): void {
    this.selectedSort.set(sort);
  }

  onPriceRangeChange(range: [number, number]): void {
    this.priceRange.set(range);
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedRating.set(null);
    this.priceRange.set([0, 200000]);
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery() || this.selectedCategory() || this.selectedRating() ||
      this.priceRange()[0] > 0 || this.priceRange()[1] < 200000);
  }
}
