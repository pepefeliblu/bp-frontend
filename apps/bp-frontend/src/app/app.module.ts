import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ProductsDomainModule } from '@bp-frontend/products-domain';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    ProductsDomainModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
