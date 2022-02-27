import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductData } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { HomeComponent } from '../home/home.component';
import { SeverResponseData } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-list-by-cate',
  templateUrl: './product-list-by-cate.component.html',
  styleUrls: ['./product-list-by-cate.component.scss'],
})
export class ProductListByCateComponent implements OnInit {
  products: ProductData[] = [];
  category: string= '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoryService,
    private productService: ProductService
    ){
  }

  ngOnInit(): void {
    this.getProductsByCate();
  }

  ngOnChanges() {
  }

  getProductsByCate() {
    const cateName = this.route.snapshot.paramMap.get('cateName');
    this.productService.getProductsByCategory(cateName)
      .subscribe((item: SeverResponseData) => {
        this.products = item.data;
        this.category = item.data[0].category;
      })
  }

  AddProduct(value: number){}
}
