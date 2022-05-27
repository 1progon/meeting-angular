import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout-with-sidebars',
  templateUrl: './layout-with-sidebars.component.html',
  styleUrls: ['./layout-with-sidebars.component.scss']
})
export class LayoutWithSidebarsComponent implements OnInit {

  constructor() {
  }

  showSidebar = false;

  ngOnInit(): void {
  }


  getHeaderEvent(value: boolean) {
    this.showSidebar = value
  }


}
