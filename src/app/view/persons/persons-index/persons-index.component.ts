import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../services/persons/persons.service";
import {BaseListingDto} from "../../../dto/BaseListingDto";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {PersonDto} from "../../../dto/persons/PersonDto";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-persons-index',
  templateUrl: './persons-index.component.html',
  styleUrls: ['./persons-index.component.scss']
})
export class PersonsIndexComponent implements OnInit {

  constructor(public personsService: PersonsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  host = environment.apiHost

  timeId?: ReturnType<typeof setTimeout>;

  routeData: string = "";
  pageTitle: string = ""

  paginatedRoute = "persons";

  persons: BaseListingDto<PersonDto> = <BaseListingDto<PersonDto>>{};
  personsFiltered: BaseListingDto<PersonDto> = <BaseListingDto<PersonDto>>{};
  offset = 0;
  limit = 20;
  pageId: number = 0;
  loading: boolean = false;

  //Filters
  activeGenderFilter: string = 'Female';

  ageRange?: Array<number>;
  ageRangeFiltered?: Array<number>;
  ageFromSelected: number = 18;
  ageToSelected: number = 100;

  loadingStart() {
    this.timeId = setTimeout(() => {
      this.loading = true;
    }, 30)
  }

  loadingStop() {
    clearTimeout(this.timeId)
    this.timeId = undefined;
    this.loading = false;
  }


  ngOnInit(): void {

    // Get route data like title, route name and others
    this.activatedRoute.data.subscribe({
      next: data => {
        this.routeData = data['route']
        this.pageTitle = data['title']
      }, error: err => console.error(err)
    })


    // Get route params
    this.activatedRoute.params.subscribe({
      next: params => {

        this.pageId = params['pageId'] ?? 1
        this.offset = (this.pageId - 1) * this.limit;

        // if simple route without country and city
        if (this.routeData == 'persons-index') {
          //try to get location from storage
          this.personsService.activeCountrySlug = localStorage.getItem('country') ?? '';
          this.personsService.activeCitySlug = localStorage.getItem('city') ?? '';

          if (this.personsService.activeCountrySlug != '' && this.personsService.activeCitySlug != '') {
            this.router.navigateByUrl('/persons/' + this.personsService.activeCountrySlug + '/' + this.personsService.activeCitySlug).finally();
            return;
          }

          if (this.personsService.activeCountrySlug != '') {
            this.router.navigateByUrl('/persons/' + this.personsService.activeCountrySlug).finally();
            return;
          }

        }

        // get slugs from route
        this.personsService.activeCountrySlug = params['countrySlug'] ?? '';
        this.personsService.activeCitySlug = params['citySlug'] ?? '';


        // Set page title
        document.title = this.pageTitle + ' ' + this.pageId;

        if (this.personsService.activeCountrySlug != '' && this.personsService.activeCitySlug != '') {
          this.paginatedRoute = 'persons/' + this.personsService.activeCountrySlug + '/' + this.personsService.activeCitySlug
          this.getPersonsByCityAndCountry(this.personsService.activeCountrySlug, this.personsService.activeCitySlug);
          return;
        }

        if (this.personsService.activeCountrySlug != '') {
          this.paginatedRoute = 'persons/' + this.personsService.activeCountrySlug
          this.getPersonsByCountry(this.personsService.activeCountrySlug);
          return
        }

        this.getPersons();


      }, error: err => console.error(err)
    });


  }

  getPersons() {
    this.loadingStart()

    return this.personsService.getPersonsDto(this.limit, this.offset)
      .subscribe({
        next: value => {
          this.persons = value.data;
          this.updateGenderFilter();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          if (err.status == 401) {
            this.router.navigateByUrl('/login').finally()
            return
          }
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
          this.persons = value.data;
          this.updateGenderFilter();
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
          this.updateGenderFilter();
        }, error: err => console.log(err)
      })
      .add(() => {
        this.loadingStop();
      })

  }


  scrollToTop() {
    if (this.persons.pagination?.current_page < this.persons.pagination.last_page) {
      document.body.scrollIntoView();
    }
  }

  updateGenderFilter() {
    localStorage.setItem('gender', this.activeGenderFilter);
    console.log(this.persons);
    this.personsFiltered.items = this.persons.items.filter(p => p.person_char?.gender == this.activeGenderFilter);
    console.log(this.persons);
  }

  updateAgeRange() {
    if (this.ageFromSelected > this.ageToSelected) {
      this.ageToSelected = this.ageFromSelected;
    }

    //save to storage
    localStorage.setItem('age', JSON.stringify({from: this.ageFromSelected, to: this.ageToSelected}));

    this.ageRangeFiltered = this.ageRange?.filter(age => age >= this.ageFromSelected);
  }


}
















