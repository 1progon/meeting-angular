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
    this.route.params.subscribe({
      next: params => {
        this.pageId = params['pageId'];

        this.offset = (this.pageId - 1) * this.limit;

        this.getPersonsByUser();
      }
    })
  }


  getPersonsByUser() {
    this.personsService.getPersonsDtoByUser(this.limit, this.offset)
      .subscribe({
        next: value => {
          this.persons = value.data;

        }, error: (err: HttpErrorResponse) => console.error(err.error)
      })
  }

  scrollToTop() {
    if (this.persons.pagination.current_page < this.persons.pagination.last_page) {
      document.body.scrollIntoView();
    }
  }

  deletePerson(id: number) {
    let answer = confirm(`Are you sure to remove person with ID ${id}`);
    if (!answer) {
      return;
    }

    let answer2 = confirm("Exactly?");
    if (!answer2) {
      return;
    }

    this.isDeleteAllow = false;
    this.alert = {
      message: 'Trying to remove...',
      status: 'warning'
    }

    this.personsService.deletePerson(id)
      .subscribe({
        next: value => {

          this.alert = {
            message: `Person with ID ${id} has been removed`,
            status: 'success'
          };

          this.getPersonsByUser();

        }, error: err => {
          this.alert = {
            message: 'Not removed, some error',
            status: 'danger'
          }
          console.error(err);
        }
      })
      .add(() => {
        this.isDeleteAllow = true;

        setTimeout(() => {
          this.alert = undefined;
        }, 2500)
      })


  }
}
