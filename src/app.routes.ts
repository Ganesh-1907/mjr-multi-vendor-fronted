import { Routes } from '@angular/router';
import { roleGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
      { path: 'auth', children: [
        { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
        { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
        { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) }
      ]},
      { path: 'products', loadComponent: () => import('./features/public/products/products.component').then(m => m.ProductsComponent) },
      { path: 'products/:slug', loadComponent: () => import('./features/public/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'categories', loadComponent: () => import('./features/public/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'vendors/:id', loadComponent: () => import('./features/public/vendor-store/vendor-store.component').then(m => m.VendorStoreComponent) },
      { path: 'about', loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent) },
      { path: 'offers', loadComponent: () => import('./features/public/offers/offers.component').then(m => m.OffersComponent) },
      { path: 'contact', loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'faq', loadComponent: () => import('./features/public/faq/faq.component').then(m => m.FaqComponent) },
      { path: 'terms', loadComponent: () => import('./features/public/terms/terms.component').then(m => m.TermsComponent) },
      { path: 'privacy', loadComponent: () => import('./features/public/privacy/privacy.component').then(m => m.PrivacyComponent) },
      { path: 'cart', loadComponent: () => import('./features/public/cart/cart.component').then(m => m.CartComponent), canActivate: [roleGuard(['customer'])] },
      { path: 'wishlist', loadComponent: () => import('./features/public/wishlist/wishlist.component').then(m => m.WishlistComponent), canActivate: [roleGuard(['customer'])] },
      { path: 'checkout', loadComponent: () => import('./features/public/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [roleGuard(['customer'])] }
    ]
  },
  {
    path: 'customer',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: 'vendor',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    loadChildren: () => import('./features/vendor/vendor.routes').then(m => m.VENDOR_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
