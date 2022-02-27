import { Component, OnInit } from '@angular/core';
import { ProductData, SeverResponseData } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: ProductData[] = [];

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProducts(9)
      .subscribe((products : SeverResponseData) => {
        this.products = products.data;
      });
  }

  AddProduct(value: any) {}

}
