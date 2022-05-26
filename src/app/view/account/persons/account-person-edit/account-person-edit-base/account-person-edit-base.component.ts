import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IPerson} from "../../../../../interfaces/persons/IPerson";

@Component({
  selector: 'app-account-person-edit',
  templateUrl: './account-person-edit-base.component.html',
  styleUrls: ['./account-person-edit-base.component.scss']
})
export class AccountPersonEditBaseComponent implements OnInit {

  constructor(public route: ActivatedRoute) {
  }

  form: IPerson = <IPerson>{}
  updating: any;

  ngOnInit(): void {
  }

  submitForm() {
    console.log(this.form)
  }


}
