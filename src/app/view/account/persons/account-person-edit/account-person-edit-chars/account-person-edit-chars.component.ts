import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-person-edit-chars',
  templateUrl: './account-person-edit-chars.component.html',
  styleUrls: ['./account-person-edit-chars.component.scss']
})
export class AccountPersonEditCharsComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  personId?: number;

  ngOnInit(): void {
    this.personId = this.route.parent?.snapshot.params['id'];

  }

}
