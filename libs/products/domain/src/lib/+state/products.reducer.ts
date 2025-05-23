import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { productsAdapter, initialProductsState } from './products.state';

export const productsReducer = createReducer(
  initialProductsState,
  
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductsActions.loadProductsSuccess, (state, { products }) =>
    productsAdapter.setAll(products, {
      ...state,
      loading: false,
      loaded: true
    })
  ),
  
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

