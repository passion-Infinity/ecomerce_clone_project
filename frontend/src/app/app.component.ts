import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  seletecedNav: string;
  onSelectNav(value: string) {
    this.seletecedNav = value;
  }
}
