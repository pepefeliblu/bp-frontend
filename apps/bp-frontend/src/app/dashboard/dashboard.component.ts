import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '@bp-frontend/shared-ui';
import { Store } from '@ngrx/store';
import * as ProductsActions from '@bp-frontend/products-domain';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(ProductsActions.loadProducts());
  }
}
