import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PRODUCTS_FEATURE_KEY, ProductsState, productsAdapter } from './products.state';

export const selectProductsState = createFeatureSelector<ProductsState>(PRODUCTS_FEATURE_KEY);

const { selectAll, selectEntities } = productsAdapter.getSelectors();

export const selectAllProducts = createSelector(selectProductsState, selectAll);
export const selectProductEntities = createSelector(selectProductsState, selectEntities);
export const selectProductsLoading = createSelector(selectProductsState, state => state.loading);
export const selectProductsError = createSelector(selectProductsState, state => state.error);
export const selectProductsLoaded = createSelector(selectProductsState, state => state.loaded);

