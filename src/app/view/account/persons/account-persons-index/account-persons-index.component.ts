import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../../services/persons/persons.service";
import {HttpErrorResponse} from "@angular/common/http";
import {PersonDto} from "../../../../dto/persons/PersonDto";
import {BaseListingDto} from "../../../../dto/BaseListingDto";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-persons-index',
  templateUrl: './account-persons-index.component.html',
  styleUrls: ['./account-persons-index.component.scss']
})
export class AccountPersonsIndexComponent implements OnInit {

  constructor(private personsService: PersonsService, private route: ActivatedRoute) {
  }

  persons: BaseListingDto<PersonDto> = <BaseListingDto<PersonDto>>{}
  limit = 20;
  offset = 0;
  paginatedRoute = 'account/persons';
  pageId = 1;
  alert?: {
    status: string;
    message: string;
  };

  isDeleteAllow = true;

  ngOnInit(): void {
    this.getPersonsByUser()
  }


  getPersonsByUser() {
    this.personsService.getPersonsDtoByUser()
      .subscribe({
        next: value => {
          this.persons = value.data;

        }, error: (err: HttpErrorResponse) => console.error(err.error)
      })
  }

}
