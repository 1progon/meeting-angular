import {Component, Input, OnInit} from '@angular/core';
import {IPagination} from "../../../interfaces/IPagination";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: IPagination = {} as IPagination
  @Input() route: string = ""

  constructor() {
  }


  ngOnInit(): void {
  }

}
