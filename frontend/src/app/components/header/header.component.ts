import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesResponseData, CategoryData } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: CategoryData[] = [];

  @Output() selectedNav = new EventEmitter<string>();

  constructor(
    private categoryService: CategoryService,
    private route: Router,
    ) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((item: CategoriesResponseData) => {
      this.categories = item.data;
    })
  }

  onSelected(value: string):void {
    this.route.navigate([`/products/category/${value}`]);
    this.selectedNav.emit(value);
  }

}
