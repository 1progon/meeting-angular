import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout-full-width',
  templateUrl: './layout-full-width.component.html',
  styleUrls: ['./layout-full-width.component.scss']
})
export class LayoutFullWidthComponent implements OnInit {

  constructor() {
  }

  showSidebar = false;

  ngOnInit(): void {
  }

  getHeaderEvent(value: boolean) {
    this.showSidebar = value
  }

}
