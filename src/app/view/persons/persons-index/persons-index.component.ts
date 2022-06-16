import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../services/persons/persons.service";
import {BaseListingDto} from "../../../dto/BaseListingDto";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {PersonDto} from "../../../dto/persons/PersonDto";
import {Observable} from "rxjs";
import {IResponse} from "../../../interfaces/IResponse";

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
    // fill age range array with age numbers
    this.ageRange = Array(200)
      .fill(18)
      .map((age, index) => age + index)
      .filter(age => age >= 18 && age <= 100);

    //set age from storage
    let ageJson = localStorage.getItem('age');
    if (ageJson) {
      let {from, to} = JSON.parse(ageJson);
      if (from >= 18 && to <= 100 && to >= from) {
        this.ageFromSelected = from;
        this.ageToSelected = to;
      } else {
        localStorage.removeItem('age')
      }
    }

    // fill age range array with age numbers
    this.ageRangeFiltered = Array(200)
      .fill(18)
      .map((age, index) => age + index)
      .filter(age => age >= this.ageFromSelected && age <= 100);


    // get gender from storage
    let gender = localStorage.getItem('gender');
    if (gender && (gender == 'Male' || gender == 'Female')) {
      this.activeGenderFilter = gender;
    } else {
      localStorage.removeItem('gender')
    }

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

        //try to get location ids from storage
        this.personsService.activeCountryId = parseInt(localStorage.getItem('country') ?? '');
        this.personsService.activeCityId = parseInt(localStorage.getItem('city') ?? '');


        // if simple route without country and city
        if (this.routeData == 'persons-index') {
          //try to get location slugs from storage
          let countrySlug = localStorage.getItem('country_slug');
          let citySlug = localStorage.getItem('city_slug');

          if (countrySlug && citySlug) {
            this.router.navigateByUrl('/persons/' + countrySlug + '/' + citySlug).finally();
            return;
          }

          if (countrySlug) {
            this.router.navigateByUrl('/persons/' + countrySlug).finally();
            return;
          }

        }


        // try to get slugs from route
        let countrySlug = params['countrySlug'] ?? '';
        let citySlug = params['citySlug'] ?? '';


        // Set page title
        document.title = this.pageTitle + ' ' + this.pageId;

        if (countrySlug != '' && citySlug != '') {
          this.paginatedRoute = 'persons/' + countrySlug + '/' + citySlug
          this.getPersons(this.personsService.activeCountryId, this.personsService.activeCityId);
          return;
        }

        if (countrySlug != '') {
          this.paginatedRoute = 'persons/' + countrySlug
          this.getPersons(this.personsService.activeCountryId);
          return
        }

        this.getPersons();


      }, error: err => console.error(err)
    });
  }

  getPersons(countryId?: number, cityId?: number) {
    this.loadingStart();

    let obs: Observable<IResponse<BaseListingDto<PersonDto>>>;

    if (countryId && cityId) {
      obs = this.personsService
        .getPersons(this.limit, this.offset,
          new Map<string, any>([['country', countryId], ['city', cityId]]))
    } else if (countryId) {
      obs = this.personsService
        .getPersons(this.limit, this.offset,
          new Map<string, any>([['country', countryId]]))
    } else {
      obs = this.personsService.getPersons(this.limit, this.offset)
    }

    return obs.subscribe({
      next: res => {
        this.persons = res.data;
        this.personsFiltered = res.data;
      },
      error: err => console.error(err)
    }).add(() => this.loadingStop())

  }

  scrollToTop() {
    if (this.persons.pagination?.current_page < this.persons.pagination.last_page) {
      document.body.scrollIntoView();
    }
  }

  updateGenderFilter() {
    localStorage.setItem('gender', this.activeGenderFilter);

    //  todo implement request persons with gender filter change
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
















