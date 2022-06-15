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

  countries: ICountry[] = [];
  updating = false;

  countryIndexInArray = -1;

  ngOnInit(): void {
    this.locationService.getAllCountries()
      .subscribe({
        next: response => {
          this.countries = response.data;

        }, error: err => console.error(err)
      })
  }

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

}
