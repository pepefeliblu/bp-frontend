import { createAction, props } from '@ngrx/store';
import { Product } from '@bp-frontend/shared-models';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const addProduct = createAction(
  '[Products] Add Product',
  props<{ product: Product }>()
);

export const addProductSuccess = createAction(
  '[Products] Add Product Success',
  props<{ product: Product }>()
);

export const addProductFailure = createAction(
  '[Products] Add Product Failure',
  props<{ error: string }>()
);

export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ product: Product }>()
);

export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: string }>()
);

