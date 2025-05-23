import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PRODUCTS_FEATURE_KEY } from './+state/products.state';
import { productsReducer } from './+state/products.reducer';
import { ProductsEffects } from './+state/products.effects';
import { ProductsService } from './services/products.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(PRODUCTS_FEATURE_KEY, productsReducer),
    EffectsModule.forFeature([ProductsEffects])
  ],
  providers: [ProductsService, provideHttpClient(withInterceptorsFromDi())]
})
export class ProductsDomainModule {}

