import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  minPrice = '';
  maxPrice = '';
  showAddForm = false;
  showDeleteModal = false;
  productForm: FormGroup;
  editingProduct: Product | null = null;
  productToDelete: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  searchProducts(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.products;

    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === this.selectedCategory);
    }

    if (this.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(this.minPrice));
    }
    if (this.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(this.maxPrice));
    }

    this.filteredProducts = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.filteredProducts = this.products;
  }

  showAddProductForm(): void {
    this.showAddForm = true;
    this.editingProduct = null;
    this.productForm.reset();
  }

  showEditProductForm(product: Product): void {
    this.showAddForm = true;
    this.editingProduct = product;
    this.productForm.patchValue(product);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct.id, { ...this.editingProduct, ...productData })
          .subscribe(() => {
            this.loadProducts();
            this.cancelForm();
          });
      } else {
        this.productService.createProduct(productData)
          .subscribe(() => {
            this.loadProducts();
            this.cancelForm();
          });
      }
    }
  }

  showDeleteConfirmation(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
        this.loadProducts();
        this.cancelDeleteModal();
      });
    }
  }

  cancelDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
} 