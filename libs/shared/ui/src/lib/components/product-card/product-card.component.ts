import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Product } from '@bp-frontend/shared-models';

@Component({
  selector: 'bp-product-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
}

