import {Component, OnInit} from '@angular/core';
import {IPerson} from "../../../../interfaces/persons/IPerson";

@Component({
  selector: 'app-account-person-create',
  templateUrl: './account-person-create.component.html',
  styleUrls: ['./account-person-create.component.scss']
})
export class AccountPersonCreateComponent implements OnInit {

  constructor() {
  }


  form: IPerson = <IPerson>{}

  ngOnInit(): void {
  }

  submitForm() {
    console.log(this.form)
  }

}
