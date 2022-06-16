import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocationService} from "../../../services/locations/location.service";
import {ICountry} from "../../../interfaces/location/ICountry";
import {PersonsService} from "../../../services/persons/persons.service";

interface IVisibleCountryElement {
  [id: number]: boolean;
}

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @Output() closeMenuEvent = new EventEmitter<boolean>();

  constructor(private service: LocationService,
              public personsService: PersonsService) {
  }

  countries: ICountry[] = [];
  countriesFiltered: ICountry[] = this.countries;


  expandedCountries?: IVisibleCountryElement;
  cacheOfExpandedCountries?: IVisibleCountryElement;

  loading = false;

  filterCountryText: string = '';

  ngOnInit(): void {
    this.personsService.activeCountrySlug = localStorage.getItem('country') ?? '';
    this.personsService.activeCitySlug = localStorage.getItem('city') ?? '';

    this.getCountries();
  }

  getCountries() {
    this.loading = true;
    this.service.getCountriesWithPersons()
      .subscribe({
        next: value => {
          this.countries = value.data;
          this.countriesFiltered = value.data;

          if (this.personsService.activeCountrySlug != ''
            && this.personsService.activeCitySlug != '') {

            let country = this.countries
              .find(c => c.slug == this.personsService.activeCountrySlug);
            if (!country) {
              return;
            }

            this.countriesFiltered = [country];

            this.getCities(country.slug, country.id);
          }

          if (this.personsService.activeCountrySlug != '') {
            let country = this.countries
              .find(c => c.slug == this.personsService.activeCountrySlug);
            if (!country) {
              return;
            }

            this.countriesFiltered = [country];
          }

        },
        error: err => console.error(err)
      })
      .add(() => {
        this.loading = false;
      })
  }

  getCities(countrySlug: string, countryId: number) {
    // Collapse - expand cities on country
    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[countryId] = !this.expandedCountries[countryId];

    let country = this.countriesFiltered.find(c => c.slug == countrySlug);
    if (!country) {
      return;
    }

    //Check if cities already has got
    if (country?.cities) {
      return;
    }

    // Get cities
    this.service.getCitiesWithPersonsByCountryId(country.id)
      .subscribe({
        next: res => {
          if (country) {
            country.cities = res.data;
          }

        }, error: err => console.error(err)
      })

  }

  closeMenu() {
    this.closeMenuEvent.emit(true)
  }

  setCountryActive(slug: string) {
    this.filterCountryText = '';
    let activeCountry = this.countriesFiltered.find(c => c.slug == slug)

    if (!activeCountry) {
      return;
    }

    this.countriesFiltered = [activeCountry];
    this.personsService.activeCountrySlug = slug;
    this.personsService.activeCitySlug = '';
    localStorage.setItem('country', slug);
    localStorage.removeItem('city')
  }

  setCityAndCountryActive(citySlug: string, countrySlug: string) {
    this.filterCountryText = '';
    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[0] = true;
    let activeCountry = this.countriesFiltered.find(c => c.slug == countrySlug)

    if (!activeCountry) {
      return;
    }

    this.countriesFiltered = [activeCountry];
    this.personsService.activeCountrySlug = countrySlug;
    this.personsService.activeCitySlug = citySlug;
    localStorage.setItem('country', countrySlug);
    localStorage.setItem('city', citySlug)
  }

  resetLocation() {
    this.getCountries();
    this.personsService.activeCitySlug = '';
    this.personsService.activeCountrySlug = '';
    this.expandedCountries = {};
    localStorage.removeItem('country')
    localStorage.removeItem('city')
  }

  filterCountries() {
    //check if visible rows cached
    if (!this.cacheOfExpandedCountries) {
      this.cacheOfExpandedCountries = this.expandedCountries;
    }

    //set visible rows to zero
    this.expandedCountries = undefined;

    //if no text entered or backspaced or clicked x to clear input
    if (this.filterCountryText == '') {
      this.expandedCountries = this.cacheOfExpandedCountries;
      this.cacheOfExpandedCountries = undefined;

      //set country like before filter. Cancel filter
      if (this.personsService.activeCountryId && this.personsService.activeCountryId != 0) {
        this.countriesFiltered = this.countries.filter(c => c.id == this.personsService.activeCountryId);
      } else {
        this.countriesFiltered = this.countries;
      }
      return;
    }

    // set filtered countries list
    this.countriesFiltered = this.countries
      .filter(c => c.name.toLowerCase().match(this.filterCountryText.toLowerCase())
        || c.slug.match(this.filterCountryText.toLowerCase()));
  }


}
