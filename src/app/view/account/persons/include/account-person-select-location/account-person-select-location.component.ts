import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ICity} from "../../../../../interfaces/location/ICity";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../../../../services/locations/location.service";
import {ICountry} from "../../../../../interfaces/location/ICountry";
import {IPerson} from "../../../../../interfaces/persons/IPerson";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-account-person-select-location',
  templateUrl: './account-person-select-location.component.html',
  styleUrls: ['./account-person-select-location.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
})
export class AccountPersonSelectLocationComponent implements OnInit, OnChanges {
  @Input() person: IPerson = <IPerson>{}

  constructor(public route: ActivatedRoute,
              private locationService: LocationService) {
  }

  countries?: ICountry[];
  updating = false;

  ngOnInit(): void {
    this.updating = true;
    this.locationService.getAllCountries()
      .subscribe({
        next: response => {
          this.countries = response.data;

          // set country object for select
          if (this.person.country) {
            let findCountry = response.data.find(c => c.id == this.person.country.id);
            if (findCountry) {
              this.person.country = findCountry
            }
          }

        }, error: err => console.error(err)
      })
      .add(() => this.updating = false)


  }

  // onClick country select
  changeCountry() {

    // Get Index element of Country in Countries Array
    this.countryIndexInArray = this.countries.indexOf(this.form.country)

    this.form.city = <ICity>{}

    // If cities already parsed earlier from backend, do nothing
    if (this.countries[this.countryIndexInArray].cities) {
      return
    }

    // Start updating
    this.updating = true;

    // Get cities from backend by selected country slug
    this.locationService.getCitiesByCountrySlug(this.person.country.slug)
      .subscribe({
        next: value => {

          // Store cities on countries array locally
          this.countries[this.countryIndexInArray].cities = value.data;

        }, error: err => console.error(err)
      })
      .add(() => {

        // Stop loading
        this.updating = false;
      })


  }

  // Check this.form changes
  ngOnChanges(changes: SimpleChanges): void {

    // if country and city set from input
    if (changes['person'] && this.person.country) {
      if (this.countries) {
        let findCountry = this.countries.find(c => c.id == this.person.country.id);
        if (findCountry) {
          this.person.country = findCountry
        }
      }

      this.locationService
        .getCitiesByCountrySlug(this.person.country.slug)
        .subscribe({
          next: value => {
            this.person.country.cities = value.data;

            this.person.city = value.data.find(c => c.id == this.person.city.id) ?? <ICity>{}

          }, error: err => console.error(err)
        }).add(() => this.updating = false)
    }


  }

}
