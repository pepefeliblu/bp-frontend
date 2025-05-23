import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Product } from '@bp-frontend/shared-models';

export const PRODUCTS_FEATURE_KEY = 'products';

export interface ProductsState extends EntityState<Product> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const productsAdapter = createEntityAdapter<Product>();

export const initialProductsState: ProductsState = productsAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null
});

