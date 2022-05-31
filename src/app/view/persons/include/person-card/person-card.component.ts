import {Component, Input, OnInit} from '@angular/core';
import {PersonDto} from "../../../../dto/persons/PersonDto";

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() person: PersonDto = {} as PersonDto
  @Input() path: string = ""

  constructor() {
  }

  ngOnInit(): void {
  }

}
