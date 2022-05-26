import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocationService} from "../../../services/locations/location.service";
import {ICountry} from "../../../interfaces/location/ICountry";

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})


export class LeftSidebarComponent implements OnInit {
  @Output() closeMenuEvent = new EventEmitter<boolean>();

  constructor(private service: LocationService) {
  }

  countries: ICountry[] = [];
  visible: { [id: number]: boolean } = {}

  ngOnInit(): void {
    this.service.getCountriesWithPersons()
      .subscribe({
        next: value => {
          this.countries = value.data;
        },
        error: err => console.error(err)
      })
  }

  getCities(countryId: number, elementId: number) {
    // Collapse - expand cities on country
    this.visible[elementId] = !this.visible[elementId];

    let country = this.countries.find(c => c.id == countryId);

    //Check if cities already has got
    if (country?.cities) {
      return;
    }

    // Get cities
    this.service.getCitiesWithPersonsByCountryId(countryId)
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
}
