import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../services/persons/persons.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonDto} from "../../../dto/persons/PersonDto";
import {IPersonPhoneMessenger, messengersMap} from "../../../interfaces/persons/IPersonPhoneMessenger";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-persons-show',
  templateUrl: './persons-show.component.html',
  styleUrls: ['./persons-show.component.scss']
})
export class PersonsShowComponent implements OnInit {

  constructor(private personsService: PersonsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  personDto: PersonDto = {} as PersonDto;
  id: number = 0;

  messengers: IPersonPhoneMessenger = messengersMap;

  path = environment.apiHost;
  isModal: boolean = false;

  loading = false;
  timeId?: ReturnType<typeof setTimeout>;

  loadingStart() {
    this.timeId = setTimeout(() => {
      this.loading = true;
    }, 30)
  }

  loadingStop() {
    clearTimeout(this.timeId)
    this.timeId = undefined;
    this.loading = false;
  }

  getPerson() {
    if (this.id > 0) {
      this.loadingStart();

      this.personsService
        .getSinglePersonDto(this.id)
        .subscribe({
          next: value => {
            this.personDto = value.data;
          },
          error: err => console.error(err)
        })
        .add(() => {
          this.loadingStop();
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
