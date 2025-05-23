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
}

