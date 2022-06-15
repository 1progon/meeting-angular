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
          this.getPersons(this.personsService.activeCountrySlug, this.personsService.activeCitySlug);
          return;
        }

        if (this.personsService.activeCountrySlug != '') {
          this.paginatedRoute = 'persons/' + this.personsService.activeCountrySlug
          this.getPersons(this.personsService.activeCountrySlug);
          return
        }

        this.getPersons();


      }, error: err => console.error(err)
    });
  }

  getPersons(countrySlug?: string, citySlug?: string) {
    this.loadingStart();

    let obs: Observable<IResponse<BaseListingDto<PersonDto>>>;

    if (countrySlug && citySlug) {
      obs = this.personsService
        .getPersons(this.limit, this.offset,
          new Map<string, any>([['countrySlug', countrySlug], ['citySlug', citySlug]]))
    } else if (countrySlug) {
      obs = this.personsService
        .getPersons(this.limit, this.offset,
          new Map<string, any>([['countrySlug', countrySlug]]))
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
















