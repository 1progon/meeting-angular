import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IPerson} from "../../../../../interfaces/persons/IPerson";
import {PersonsService} from "../../../../../services/persons/persons.service";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-account-person-edit',
  templateUrl: './account-person-edit-base.component.html',
  styleUrls: ['./account-person-edit-base.component.scss']
})
export class AccountPersonEditBaseComponent implements OnInit {

  constructor(public route: ActivatedRoute,
              private personsService: PersonsService) {
  }


  personId?: number;
  form: IPerson = <IPerson>{}
  updating: any;
  image?: string;
  path = environment.apiHost;


  ngOnInit(): void {
    this.personId = this.route.snapshot.parent?.params['id'];
    if (this.personId) {
      this.getPerson(this.personId);
    }


  }

  getPerson(id: number) {
    this.personsService.getPersonEditBase(id)
      .subscribe({
        next: value => {

          this.form = value.data;

        }, error: err => {
          console.error(err)
        }
      })

  }


  submitForm() {
    console.log(this.form)
  }


}
