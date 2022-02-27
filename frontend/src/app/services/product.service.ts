import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SeverResponseData, ProductData } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private BASE_URL = environment.BASE_URL;

  constructor(
    private http: HttpClient, 
  ) {}

  getAllProducts(limit: number = 10): Observable<SeverResponseData> {
    return this.http.get<SeverResponseData>(this.BASE_URL + '/products', {
      params: {
        limit: limit,
      }
    });
  }

  getProductById(id: number): Observable<ProductData> {
    return this.http.get<ProductData>(this.BASE_URL + `/products/${id}`);
  }

  getProductsByCategory(cateName: string): Observable<SeverResponseData> {
    return this.http.get<SeverResponseData>(this.BASE_URL + `/products/category/${cateName}`);
  }
}
