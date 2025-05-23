import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@bp-frontend/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = 'http://localhost:3002/bp/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.API_URL);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/verification/${id}`);
  }
}

