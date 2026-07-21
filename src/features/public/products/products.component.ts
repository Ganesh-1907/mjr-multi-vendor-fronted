import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ApiDataService, ProductPreview, Category } from '../../../core/services/api-data.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatExpansionModule, MatDividerModule, MatPaginatorModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiData = inject(ApiDataService);

  products = signal<ProductPreview[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);

  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  selectedSort = signal('');
  priceRange = signal<[number, number]>([0, 200000]);
  currentPage = signal(0);
  pageSize = signal(20);
  selectedRating = signal<number | null>(null);
  isFeaturedFilter = signal(false);
  isTrendingFilter = signal(false);

  isMobileFiltersOpen = signal(false);

  private searchSubject = new Subject<string>();
  private priceSubject = new Subject<[number, number]>();

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.selectedCategory.set(params['category'] || null);
      this.searchQuery.set(params['search'] || '');
      this.isFeaturedFilter.set(params['featured'] === 'true');
      this.isTrendingFilter.set(params['trending'] === 'true');
      this.currentPage.set(0);
      this.loadProducts();
    });

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchQuery.set(value);
      this.currentPage.set(0);
      this.loadProducts();
    });

    this.priceSubject.pipe(
      debounceTime(500)
    ).subscribe(range => {
      this.priceRange.set(range);
      this.currentPage.set(0);
      this.loadProducts();
    });
  }

  private loadCategories(): void {
    this.apiData.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  private loadProducts(): void {
    this.loading.set(true);

    if (this.isFeaturedFilter()) {
      this.apiData.getFeaturedProducts().subscribe({
        next: (prods) => {
          this.products.set(prods);
          this.loading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.loading.set(false);
        }
      });
      return;
    }

    if (this.isTrendingFilter()) {
      this.apiData.getTrendingProducts().subscribe({
        next: (prods) => {
          this.products.set(prods);
          this.loading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.loading.set(false);
        }
      });
      return;
    }

    const filters: Record<string, string> = {};
    const cat = this.selectedCategory();
    if (cat) filters['category'] = cat;
    const search = this.searchQuery();
    if (search) filters['search'] = search;
    const [min, max] = this.priceRange();
    if (min > 0) filters['minPrice'] = min.toString();
    if (max < 200000) filters['maxPrice'] = max.toString();
    const sort = this.selectedSort();
    if (sort) filters['sort'] = sort;
    const rating = this.selectedRating();
    if (rating) filters['minRating'] = rating.toString();
    filters['page'] = this.currentPage().toString();
    filters['size'] = this.pageSize().toString();

    this.apiData.getProducts(filters as any).subscribe({
      next: (prods) => { this.products.set(prods); this.loading.set(false); },
      error: () => { this.products.set([]); this.loading.set(false); }
    });
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen.update(v => {
      const isOpen = !v;
      if (isOpen) {
        document.body.classList.add('body-no-scroll');
      } else {
        document.body.classList.remove('body-no-scroll');
      }
      return isOpen;
    });
  }

  updateSearch(value: string): void {
    this.searchSubject.next(value);
  }

  selectCategory(catSlug: string | null): void {
    this.selectedCategory.set(catSlug);
    this.currentPage.set(0);
    this.loadProducts();
  }

  setSort(sort: string): void {
    this.selectedSort.set(sort);
    this.currentPage.set(0);
    this.loadProducts();
  }

  onPriceRangeChange(range: [number, number]): void {
    this.priceSubject.next(range);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.priceRange.set([0, 200000]);
    this.selectedSort.set('');
    this.selectedRating.set(null);
    this.isFeaturedFilter.set(false);
    this.isTrendingFilter.set(false);
    this.currentPage.set(0);
    this.loadProducts();
  }

  setRating(rating: number | null): void {
    this.selectedRating.set(rating);
    this.currentPage.set(0);
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery() || this.selectedCategory() ||
      this.priceRange()[0] > 0 || this.priceRange()[1] < 200000 || this.selectedSort() || this.selectedRating() ||
      this.isFeaturedFilter() || this.isTrendingFilter());
  }

  ngOnDestroy(): void {
    document.body.classList.remove('body-no-scroll');
    this.searchSubject.complete();
    this.priceSubject.complete();
  }
}
