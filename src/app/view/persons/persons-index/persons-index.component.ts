import {Component, OnInit} from '@angular/core';
import {IPerson} from "../../../interfaces/persons/IPerson";
import {PersonsService} from "../../../services/persons/persons.service";
import {BaseListingDto} from "../../../dto/BaseListingDto";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-persons-index',
  templateUrl: './persons-index.component.html',
  styleUrls: ['./persons-index.component.scss']
})
export class PersonsIndexComponent implements OnInit {

  constructor(private personsService: PersonsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  host = environment.apiHost

  timeId?: number;

  routeData: string = "";
  pageTitle: string = ""

  paginatedRoute = "persons";

  persons?: BaseListingDto<IPerson>;
  offset = 0;
  limit = 20;
  pageId: number = 0;
  loading: boolean = false;
  countrySlug = "";
  citySlug = "";


  loadingStart() {
    this.timeId = setTimeout(() => {
      this.loading = true;
    }, 300)
  }

  loadingStop() {
    clearTimeout(this.timeId)
    this.timeId = undefined;
    this.loading = false;
  }

  getPersons() {
    this.loadingStart()

    return this.personsService.getPersons(this.limit, this.offset)
      .subscribe({
        next: value => {
          this.persons = value.data;
        },
        error: err => {
          console.error(err);
          this.router.navigateByUrl('/404').finally()
        }
      }).add(() => {
        this.loadingStop();
      })


  }

  getPersonsByCountry(countrySlug: string) {
    this.loadingStart();

    return this.personsService
      .getPersonsByCountry(countrySlug, this.limit, this.offset)
      .subscribe({
        next: value => {
          this.persons = value.data
        },
        error: err => console.error(err)
      })
      .add(() => {
        this.loadingStop()
      })


  }

  getPersonsByCityAndCountry(countrySlug: string, citySlug: string) {
    this.loadingStart();

    this.personsService
      .getPersonsByCountryAndCity(countrySlug, citySlug, this.limit, this.offset)
      .subscribe({
        next: value => {
          this.persons = value.data;
        }, error: err => console.log(err)
      })
      .add(() => {
        this.loadingStop();
      })

  }

  ngOnInit(): void {
    // Get route data route param
    this.activatedRoute.data.subscribe({
      next: data => {
        this.routeData = data['route']
        this.pageTitle = data['title']
      }, error: err => console.error(err)
    })


    // Get route params
    this.activatedRoute.params.subscribe({
      next: params => {
        this.countrySlug = params['countrySlug'] ?? "";
        this.citySlug = params['citySlug'] ?? "";
        this.pageId = params['pageId'] ?? 1
        this.offset = (this.pageId - 1) * this.limit;

        // Set page title
        document.title = this.pageTitle + ' ' + this.pageId;

        if (this.routeData == 'persons-index-country') {
          this.paginatedRoute = 'persons/' + this.countrySlug
          if (this.countrySlug != "") {
            this.getPersonsByCountry(this.countrySlug);
          }

        } else if (this.routeData == 'persons-index-city') {
          this.paginatedRoute = 'persons/' + this.countrySlug + '/' + this.citySlug
          if (this.countrySlug != "" && this.citySlug != "") {
            this.getPersonsByCityAndCountry(this.countrySlug, this.citySlug);
          }
        } else {
          this.getPersons()
        }


      }, error: err => console.error(err)
    });


  }


  scrollTop() {
    document.body.scrollIntoView();
  }
}
















