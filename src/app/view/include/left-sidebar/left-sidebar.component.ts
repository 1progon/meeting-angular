import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocationService} from "../../../services/locations/location.service";
import {ICountry} from "../../../interfaces/location/ICountry";
import {ICity} from "../../../interfaces/location/ICity";

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
              public locationService: LocationService) {
  }

  countries: ICountry[] = [];
  countriesFiltered: ICountry[] = this.countries;


  expandedCountries?: IVisibleCountryElement;
  cacheOfExpandedCountries?: IVisibleCountryElement;

  loading = false;

  filterCountryText: string = '';

  ngOnInit(): void {
    let countryJson = localStorage.getItem('country');
    if (countryJson) {
      let country: ICountry = JSON.parse(countryJson);
      if (!!country) {
        this.locationService.activeCountry = country;
      }
    }

    let cityJson = localStorage.getItem('city');
    if (cityJson) {
      let city: ICity = JSON.parse(cityJson);
      if (!!city) {
        this.locationService.activeCity = city;
      }
    }

    this.getCountries();
  }

  getCountries() {
    this.loading = true;
    this.service.getCountriesWithPersons()
      .subscribe({
        next: value => {
          this.countries = value.data;
          this.countriesFiltered = value.data;

          if (this.locationService.activeCountry && this.locationService.activeCity) {
            let country = this.locationService.activeCountry;
            this.countriesFiltered = [country];
            this.getCities(country);
          }

          if (this.locationService.activeCountry) {
            let country = this.locationService.activeCountry;
            this.countriesFiltered = [country];
          }

        },
        error: err => console.error(err)
      })
      .add(() => {
        this.loading = false;
      })
  }

  getCities(country: ICountry) {
    // Collapse - expand cities on country
    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[country.id] = !this.expandedCountries[country.id];


    //Check if cities already has got
    if (country.cities) {
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

  setCountryActive(country: ICountry) {
    this.filterCountryText = '';
    delete this.expandedCountries?.[country.id];

    this.countriesFiltered = [country];
    this.locationService.activeCountry = country;
    delete this.locationService.activeCity;

    let countryWithoutCities = Object.assign({}, country)
    delete countryWithoutCities.cities;

    localStorage.setItem('country', JSON.stringify(countryWithoutCities));
    localStorage.removeItem('city')
  }

  setCountryAndCityActive(country: ICountry, city: ICity) {
    this.filterCountryText = '';

    if (!this.expandedCountries) {
      this.expandedCountries = {};
    }
    this.expandedCountries[0] = true;

    this.countriesFiltered = [country];
    this.locationService.activeCountry = country;
    this.locationService.activeCity = city;

    let countryWithoutCities = Object.assign({}, country)
    delete countryWithoutCities.cities;

    localStorage.setItem('country', JSON.stringify(countryWithoutCities));
    localStorage.setItem('city', JSON.stringify(city));
  }

  resetLocation() {
    this.getCountries();
    delete this.locationService.activeCountry;
    delete this.locationService.activeCity;
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
      if (this.locationService.activeCountry) {
        // this.countriesFiltered = this.countries.filter(c => c.id == this.locationService.activeCountry);
        this.countriesFiltered = [this.locationService.activeCountry];

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
