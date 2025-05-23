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
  })),

  on(ProductsActions.addProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductsActions.addProductSuccess, (state, { product }) =>
    productsAdapter.addOne(product, {
      ...state,
      loading: false,
      loaded: true
    })
  ),

  on(ProductsActions.addProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductsActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductsActions.updateProductSuccess, (state, { product }) =>
    productsAdapter.updateOne({ id: product.id, changes: product }, {
      ...state,
      loading: false,
      loaded: true
    })
  ),

  on(ProductsActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

