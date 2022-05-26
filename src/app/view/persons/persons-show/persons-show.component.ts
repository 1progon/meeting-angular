import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../services/persons/persons.service";
import {ActivatedRoute} from "@angular/router";
import {PersonDto} from "../../../dto/persons/PersonDto";
import {IPersonPhoneMessenger, messengersMap} from "../../../interfaces/persons/IPersonPhoneMessenger";
import {environment} from "../../../../environments/environment";
import {ratesMap} from "../../../interfaces/persons/IPersonRate";

@Component({
  selector: 'app-persons-show',
  templateUrl: './persons-show.component.html',
  styleUrls: ['./persons-show.component.scss']
})
export class PersonsShowComponent implements OnInit {

  constructor(private personsService: PersonsService, private route: ActivatedRoute) {
  }

  personDto: PersonDto = {} as PersonDto;
  id: number = 0;

  messengers: IPersonPhoneMessenger = messengersMap;

  path = environment.apiHost;
  ratesMap = ratesMap;
  isModal: boolean = false;

  getPerson() {
    if (this.id > 0) {
      this.personsService.getPersonDto(this.id).subscribe({
        next: value => {
          this.personDto = value.data;
        },
        error: err => console.error(err)
      })
    }
  }

  ngOnInit(): void {
    document.body.scrollIntoView();

    this.route.params.subscribe({
      next: params => {
        this.id = params['id'];
        document.title = this.route.snapshot.data['title'] + ' ' + this.id;
        this.getPerson();
      },
      error: err => console.error(err)
    })


  }

}
