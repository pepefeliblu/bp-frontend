import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Product } from '@bp-frontend/shared-models';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  loadProducts,
  selectAllProducts,
  selectProductsError,
  selectProductsLoading
} from '@bp-frontend/products-domain';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { map, startWith } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'bp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipDirective]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly store: Store;
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  searchControl = new FormControl('');

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
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, search]) => {
        if (!search || typeof search !== 'string' || !search.trim()) {
          return products;
        }
        const pattern = new RegExp(search.trim(), 'i');
        return products.filter(product =>
          pattern.test(product.name) || pattern.test(product.description)
        );
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
}

