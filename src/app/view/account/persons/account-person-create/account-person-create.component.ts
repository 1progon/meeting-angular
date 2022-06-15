import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../../services/persons/persons.service";
import {IPerson} from "../../../../interfaces/persons/IPerson";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-person-create',
  templateUrl: './account-person-create.component.html',
  styleUrls: ['./account-person-create.component.scss']
})
export class AccountPersonCreateComponent implements OnInit {

  constructor(private personService: PersonsService,
              private router: Router) {
  }


  person = <IPerson>{}
  imagePreview?: string | ArrayBuffer | null;
  selectedFile?: File;
  fileSize?: string;
  image?: string;

  ngOnInit(): void {
  }

  submitForm() {

    let cities = this.person.country.cities;
    delete this.person.country.cities;

    let fd = new FormData();
    if (this.selectedFile) {
      fd.append('image_file', this.selectedFile);
      fd.append('person_dto', JSON.stringify(this.person));
    }

    this.person.country.cities = cities;

    this.personService.addPerson(fd)
      .subscribe({
        next: value => {
          console.log(value)
          if (value.data.id) {
            this.router.navigateByUrl('/account/person/edit/' + value.data.id).finally();
          }


        }, error: err => console.error(err)
      })


  }

  // Convert bytes to KB, MB, GB...
  niceBytes(n: number) {
    let units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let l = 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }

  // Upload photo and preview in browser
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
      this.fileSize = this.niceBytes(this.selectedFile.size);


      let reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);

      // Show image on frontend on upload
      reader.onload = e => {
        this.imagePreview = e.target?.result;
      }
    }


  }
}
