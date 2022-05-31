import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../../services/persons/persons.service";
import {HttpErrorResponse} from "@angular/common/http";
import {PersonDto} from "../../../../dto/persons/PersonDto";

@Component({
  selector: 'app-account-persons-index',
  templateUrl: './account-persons-index.component.html',
  styleUrls: ['./account-persons-index.component.scss']
})
export class AccountPersonsIndexComponent implements OnInit {

  constructor(private personsService: PersonsService, private route: ActivatedRoute) {
  }

  persons: PersonDto[] = [];

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
