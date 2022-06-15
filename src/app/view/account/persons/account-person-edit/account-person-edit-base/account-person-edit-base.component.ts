import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IPerson} from "../../../../../interfaces/persons/IPerson";
import {PersonsService} from "../../../../../services/persons/persons.service";
import {environment} from "../../../../../../environments/environment";
import {niceBytes} from "../../../../../helpers/niceBytes";

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

  onFileSelected(event: Event) {
    let f = event.target as HTMLInputElement;
    this.selectedFile = f.files?.[0];
    if (this.selectedFile) {

      if (!this.selectedFile.type.match('image/(png|jpg|jpeg|gif)')
        || this.selectedFile.size > 20971520) {

        this.image = undefined;
        this.selectedFile = undefined;
        this.fileSize = undefined;
        this.imagePreview = undefined;
        return;
      }

      this.person.image = this.selectedFile.name;
      this.fileSize = niceBytes(this.selectedFile.size);


      let reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);

      // Show image on frontend on upload
      reader.onload = e => {
        this.imagePreview = e.target?.result;
      }
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
