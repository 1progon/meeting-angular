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
    let countryId = parseInt(localStorage.getItem('country') ?? '');
    this.personsService.activeCountryId = isNaN(countryId) ? 0 : countryId;

    let cityId = parseInt(localStorage.getItem('city') ?? '');
    this.personsService.activeCityId = isNaN(cityId) ? 0 : cityId;

    this.getCountries();
  }

  getCountries() {
    this.loading = true;
    this.service.getCountriesWithPersons()
      .subscribe({
        next: value => {
          this.countries = value.data;
          this.countriesFiltered = value.data;

          if (this.personsService.activeCountryId != 0
            && this.personsService.activeCityId != 0) {

            let country = this.countries
              .find(c => c.id == this.personsService.activeCountryId);
            if (!country) {
              return;
            }

            this.countriesFiltered = [country];

            this.getCities(country.id);
          }

          if (this.personsService.activeCountryId != 0) {
            let country = this.countries
              .find(c => c.id == this.personsService.activeCountryId);
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

  getCities(countryId: number) {
    // Collapse - expand cities on country
    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[countryId] = !this.expandedCountries[countryId];

    let country = this.countriesFiltered.find(c => c.id == countryId);
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

  setCountryActive(id: number) {
    this.filterCountryText = '';
    let activeCountry = this.countriesFiltered.find(c => c.id == id)

    if (!activeCountry) {
      return;
    }

    this.countriesFiltered = [activeCountry];
    this.personsService.activeCountryId = id;
    this.personsService.activeCityId = 0;
    localStorage.setItem('country', id.toString());
    localStorage.setItem('country_slug', activeCountry.slug);
    localStorage.removeItem('city')
    localStorage.removeItem('city_slug')
  }

  setCountryAndCityActive(countryId: number, cityId: number) {
    this.filterCountryText = '';
    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[0] = true;
    let activeCountry = this.countriesFiltered.find(c => c.id == countryId)

    if (!activeCountry) {
      return;
    }

    let activeCity = activeCountry.cities?.find(c => c.id == cityId);
    if (!activeCity) {
      return;
    }

    this.countriesFiltered = [activeCountry];
    this.personsService.activeCountryId = countryId;
    this.personsService.activeCityId = cityId;
    localStorage.setItem('country', countryId.toString());
    localStorage.setItem('country_slug', activeCountry.slug);
    localStorage.setItem('city', cityId.toString())
    localStorage.setItem('city_slug', activeCity.slug)
  }

  resetLocation() {
    this.getCountries();
    this.personsService.activeCityId = 0;
    this.personsService.activeCountryId = 0;
    this.expandedCountries = {};
    localStorage.removeItem('country')
    localStorage.removeItem('country_slug')
    localStorage.removeItem('city')
    localStorage.removeItem('city_slug')
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
