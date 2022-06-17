import {Component, OnInit} from '@angular/core';
import {BaseListingDto} from "../../../dto/BaseListingDto";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {PersonDto} from "../../../dto/persons/PersonDto";
import {Observable} from "rxjs";
import {IResponse} from "../../../interfaces/IResponse";
import {HttpErrorResponse} from "@angular/common/http";
import {LocationService} from "../../../services/locations/location.service";
import {PersonsService} from "../../../services/persons/persons.service";

@Component({
  selector: 'app-persons-index',
  templateUrl: './persons-index.component.html',
  styleUrls: ['./persons-index.component.scss']
})
export class PersonsIndexComponent implements OnInit {

  constructor(public locationService: LocationService,
              private personsService: PersonsService,
              private route: ActivatedRoute,
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
  genderSelected: string = 'All';

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
    if (gender && (gender == 'Male' || gender == 'Female' || gender == 'All')) {
      this.genderSelected = gender;
    } else {
      localStorage.removeItem('gender')
    }

    // Get route data like title, route name and others
    this.route.data.subscribe({
      next: data => {
        this.routeData = data['route']
        this.pageTitle = data['title']
      }, error: err => console.error(err)
    })


    // Get route params
    this.route.params.subscribe({
      next: params => {

        this.pageId = params['pageId'] ?? 1
        this.offset = (this.pageId - 1) * this.limit;

        // if simple route without country and city
        if (this.routeData == 'persons-index') {

          //try to get locations
          let country = this.locationService.activeCountry;
          let city = this.locationService.activeCountry;

          if (country && city) {
            this.router.navigateByUrl('/persons/' + country.slug + '/' + city.slug).finally();
            return;
          } else if (country) {
            this.router.navigateByUrl('/persons/' + country.slug).finally();
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
          this.getPersons(this.locationService.activeCountry?.id, this.locationService.activeCity?.id);
          return;
        }

        if (countrySlug != '') {
          this.paginatedRoute = 'persons/' + countrySlug
          this.getPersons(this.locationService.activeCountry?.id);
          return
        }

        this.getPersons();


      }, error: err => console.error(err)
    });
  }

  getPersons(countryId?: number, cityId?: number) {
    this.loadingStart();

    let obs: Observable<IResponse<BaseListingDto<PersonDto>>>;
    let filters = new Map<string, any>();

    if (this.genderSelected) {
      filters.set('gender', this.genderSelected);
    }
    if (countryId) {
      filters.set('country', countryId);
    }
    if (cityId) {
      filters.set('city', cityId);
    }
    if (this.ageFromSelected) {
      filters.set('ageFrom', this.ageFromSelected);
    }
    if (this.ageToSelected) {
      filters.set('ageTo', this.ageToSelected);
    }

    obs = this.personsService.getPersons(this.limit, this.offset, filters)

    return obs.subscribe({
      next: res => {
        if (Object.keys(res).length == 0 && this.route.snapshot.params['pageId'] > 1) {
          this.router.navigateByUrl('/persons').finally();
          return;
        }

        this.persons = res.data;
        this.personsFiltered = res.data;
      },
      error: (err: HttpErrorResponse) => {
        //redirect to page one
        if (err.status == 404 && this.route.snapshot.params['pageId'] > 1) {
          this.router.navigateByUrl('/persons').finally();
          return;
        }

        if (err.status == 404) {
          //set empty data
          this.personsFiltered = {} as BaseListingDto<PersonDto>;
        }

      }
    }).add(() => this.loadingStop())

  }

  scrollToTop() {
    if (this.persons.pagination?.current_page < this.persons.pagination.last_page) {
      document.body.scrollIntoView();
    }
  }

  updateGenderFilter() {
    localStorage.setItem('gender', this.genderSelected);
    this.getPersons(this.locationService.activeCountry?.id, this.locationService.activeCity?.id);
  }

  updateAgeRange() {
    if (this.ageFromSelected > this.ageToSelected) {
      this.ageToSelected = this.ageFromSelected;
    }

    //save to storage
    localStorage.setItem('age', JSON.stringify({from: this.ageFromSelected, to: this.ageToSelected}));

    this.ageRangeFiltered = this.ageRange?.filter(age => age >= this.ageFromSelected);

    // get persons
    this.getPersons(this.locationService.activeCountry?.id, this.locationService.activeCity?.id);
  }


}
















