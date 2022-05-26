import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PersonsService} from "../../../../../services/persons/persons.service";
import {IPerson} from "../../../../../interfaces/persons/IPerson";

@Component({
  selector: 'app-account-person-edit',
  templateUrl: './account-person-edit.component.html',
  styleUrls: ['./account-person-edit.component.scss']
})
export class AccountPersonEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private personsService: PersonsService) {
  }

  personId?: number;
  form: IPerson = <IPerson>{}

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

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id']

    //  Get person from backend by id person
    if (this.personId) {
      this.getPerson(this.personId);
    }
  }

}
