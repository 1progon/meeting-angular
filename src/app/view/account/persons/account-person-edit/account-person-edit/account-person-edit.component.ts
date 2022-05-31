import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-person-edit',
  templateUrl: './account-person-edit.component.html',
  styleUrls: ['./account-person-edit.component.scss']
})
export class AccountPersonEditComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  personId?: number;


  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id']


  }


}
