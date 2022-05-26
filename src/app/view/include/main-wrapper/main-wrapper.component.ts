import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  styleUrls: ['./main-wrapper.component.scss']
})
export class MainWrapperComponent implements OnInit {

  constructor() {
  }

  showSidebar = false;

  ngOnInit(): void {
  }

  getHeaderEvent(value: boolean) {
    this.showSidebar = value
  }

}
