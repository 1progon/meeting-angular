import {Component, Input, OnInit} from '@angular/core';
import {IPerson} from "../../../../interfaces/persons/IPerson";

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() person: IPerson = {} as IPerson
  @Input() path: string = ""

  constructor() {
  }

  ngOnInit(): void {
  }

}
