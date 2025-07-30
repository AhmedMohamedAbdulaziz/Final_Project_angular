import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';
  showAddForm = false;
  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  searchCategories(): void {
    if (this.searchTerm) {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredCategories = this.categories;
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCategories = this.categories;
  }

  showAddCategoryForm(): void {
    this.showAddForm = true;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  showEditCategoryForm(category: Category): void {
    this.showAddForm = true;
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.editingCategory) {
        // Update existing category
        this.categoryService.updateCategory(this.editingCategory.id, { ...this.editingCategory, ...categoryData })
          .subscribe(() => {
            this.loadCategories();
            this.cancelForm();
          });
      } else {
        // Create new category
        this.categoryService.createCategory(categoryData)
          .subscribe(() => {
            this.loadCategories();
            this.cancelForm();
          });
      }
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category? This will also affect all products in this category.')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
} 