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


  expandedCountries?: IVisibleCountryElement;
  cacheOfExpandedCountries?: IVisibleCountryElement;

  loading = false;

  ngOnInit(): void {
    this.personsService.activeCountrySlug = localStorage.getItem('country') ?? '';
    this.personsService.activeCitySlug = localStorage.getItem('city') ?? '';

    this.loading = true;
    this.service.getCountriesWithPersons()
      .subscribe({
        next: value => {
          this.countries = value.data;

          if (this.personsService.activeCountrySlug != ''
            && this.personsService.activeCitySlug != '') {

            let country = this.countries
              .find(c => c.slug == this.personsService.activeCountrySlug);
            if (!country) {
              return;
            }

            this.getCities(country.slug, this.countries.indexOf(country));
          }

        },
        error: err => console.error(err)
      })
      .add(() => {
        this.loading = false;
      })


  }

  getCities(countrySlug: string, elementId: number) {
    // Collapse - expand cities on country
    this.visible[elementId] = !this.visible[elementId];

    let country = this.countries.find(c => c.slug == countrySlug);
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
    this.personsService.activeCountrySlug = slug;
    this.personsService.activeCitySlug = '';
    localStorage.setItem('country', slug);
    localStorage.removeItem('city')
  }

  setCityAndCountryActive(citySlug: string, countrySlug: string) {
    this.personsService.activeCitySlug = citySlug;
    this.personsService.activeCountrySlug = countrySlug;
    localStorage.setItem('country', countrySlug);
    localStorage.setItem('city', citySlug)
  }

  resetLocation() {
    this.personsService.activeCitySlug = '';
    this.personsService.activeCountrySlug = '';
    this.visible = {};
    localStorage.removeItem('country')
    localStorage.removeItem('city')
  }
}
