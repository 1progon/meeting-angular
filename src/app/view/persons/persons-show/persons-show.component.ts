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

  person: PersonDto = {} as PersonDto;
  id: number = 0;

  prevId?: number;
  nextId?: number;

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
            this.person = value.data;
          },
          error: err => {
            console.error(err);
            this.router.navigateByUrl('/404').finally()
            return;
          }
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
        delete this.prevId;
        delete this.nextId;

        let idsJson = localStorage.getItem('filtered_ids')
        if (idsJson) {
          let ids: number[] = JSON.parse(idsJson)

          this.prevId = Math.max(...ids.filter(id => id < this.id))
          if (!isFinite(this.prevId)) {
            delete this.prevId;

          }
          this.nextId = Math.min(...ids.filter(id => id > this.id))
          if (!isFinite(this.nextId)) {
            delete this.nextId;

          }
        }


        this.getPerson();
      },
      error: err => console.error(err)
    })


  }

  // go back button
  back() {
    history.back();
  }
}
