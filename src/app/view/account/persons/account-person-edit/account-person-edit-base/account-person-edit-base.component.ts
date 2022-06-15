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
  person: IPerson = <IPerson>{}

  updating: any;
  imagePreview?: string | ArrayBuffer | null;
  selectedFile?: File;
  fileSize?: string;
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

          this.person = value.data;

        }, error: err => {
          console.error(err)
        }
      })

  }


  submitForm() {

    let cities = this.person.country.cities;
    delete this.person.country.cities;

    let fd = new FormData();

    if (this.selectedFile) {
      fd.append('image_file', this.selectedFile);
    }
    fd.append('person_dto', JSON.stringify(this.person));

    this.person.country.cities = cities;

    this.personsService.updatePerson(fd, this.person.id)
      .subscribe({
        next: value => {

        }, error: err => console.error(err)
      })


  }


}
