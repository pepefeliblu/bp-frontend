import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Product } from '@bp-frontend/shared-models';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  loadProducts,
  selectAllProducts,
  selectProductsError,
  selectProductsLoading,
  addProduct,
  updateProduct,
  deleteProduct
} from '@bp-frontend/products-domain';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { map, startWith } from 'rxjs/operators';
import { UpsertProductComponent } from '../upsert-product/upsert-product.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'bp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipDirective, UpsertProductComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly store: Store;
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  searchControl = new FormControl('');
  pageSizeControl = new FormControl(5);

  showAddProductModal = false;
  selectedProduct: Product | null = null;
  contextMenuOpenId: string | null = null;
  productToDelete: Product | null = null;

  get isSearchActive(): boolean {
    return !!this.searchControl.value && this.searchControl.value.trim().length > 0;
  }

  constructor(store: Store) {
    this.store = store;
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.pageSizeControl.valueChanges.pipe(startWith(this.pageSizeControl.value))
    ]).pipe(
      map(([products, search, pageSize]) => {
        const size = Number(pageSize);
        let filtered = products;
        if (search && typeof search === 'string' && search.trim()) {
          const pattern = new RegExp(search.trim(), 'i');
          filtered = products.filter(product =>
            pattern.test(product.name) || pattern.test(product.description)
          );
        }
        return filtered.slice(0, size);
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddProductModal() {
    this.selectedProduct = null;
    this.showAddProductModal = true;
  }

  openEditProductModal(product: Product) {
    this.selectedProduct = product;
    this.showAddProductModal = true;
  }

  closeAddProductModal() {
    this.showAddProductModal = false;
    this.selectedProduct = null;
  }

  handleAddProduct(product: any) {
    if (this.selectedProduct) {
      this.store.dispatch(updateProduct({ product }));
    } else {
      this.store.dispatch(addProduct({ product }));
    }
    this.closeAddProductModal();
  }

  openDeleteProductModal(product: Product) {
    this.productToDelete = product;
  }

  closeDeleteProductModal() {
    this.productToDelete = null;
  }

  confirmDeleteProduct() {
    if (this.productToDelete) {
      this.store.dispatch(deleteProduct({ id: this.productToDelete.id }));
      this.closeDeleteProductModal();
    }
  }
}

