import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ProductsActions from './products.actions';
import { ProductsService } from '../services/products.service';

@Injectable()
export class ProductsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly productsService: ProductsService
  ) {}

  loadProducts$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.loadProducts),
        switchMap(() =>
          this.productsService.getProducts().pipe(
            map((response) => ProductsActions.loadProductsSuccess({ products: response.data })),
            catchError((error) =>
              of(ProductsActions.loadProductsFailure({ error: error.message }))
            )
          )
        )
      );
    },
    { functional: true }
  );

  addProduct$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.addProduct),
        switchMap(({ product }) =>
          this.productsService.addProduct(product).pipe(
            map((createdProduct) => ProductsActions.addProductSuccess({ product: createdProduct })),
            catchError((error) => of(ProductsActions.addProductFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  );

  reloadProductsOnAdd$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.addProductSuccess),
        map(() => ProductsActions.loadProducts())
      );
    },
    { functional: true }
  );

  updateProduct$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.updateProduct),
        switchMap(({ product }) =>
          this.productsService.updateProduct(product).pipe(
            map((updatedProduct) => ProductsActions.updateProductSuccess({ product: updatedProduct })),
            catchError((error) => of(ProductsActions.updateProductFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  );

  reloadProductsOnUpdate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.updateProductSuccess),
        map(() => ProductsActions.loadProducts())
      );
    },
    { functional: true }
  );

  deleteProduct$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.deleteProduct),
        switchMap(({ id }) =>
          this.productsService.deleteProduct(id).pipe(
            map(() => ProductsActions.deleteProductSuccess({ id })),
            catchError((error) => of(ProductsActions.deleteProductFailure({ error: error.message })))
          )
        )
      );
    },
    { functional: true }
  );

  reloadProductsOnDelete$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ProductsActions.deleteProductSuccess),
        map(() => ProductsActions.loadProducts())
      );
    },
    { functional: true }
  );
}

