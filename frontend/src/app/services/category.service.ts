import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesResponseData } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CategoriesResponseData> {
    return this.http.get<CategoriesResponseData>(this.BASE_URL + `/categories`);
  }
}
