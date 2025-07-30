import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { OrdersComponent } from './components/admin/orders/orders.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'orders', component: OrdersComponent }
    ]
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];
