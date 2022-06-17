import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IResponse} from "../../interfaces/IResponse";
import {ICountry} from "../../interfaces/location/ICountry";
import {ICity} from "../../interfaces/location/ICity";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  activeCountry?: ICountry;
  activeCity?: ICity;

  getAllCountries(): Observable<IResponse<ICountry[]>> {
    return this.http.get<IResponse<ICountry[]>>(environment.apiUrl + '/countries')
  }

  getCitiesByCountrySlug(countrySlug: string) {
    return this.http.get<IResponse<ICity[]>>(environment.apiUrl + '/cities/' + countrySlug)
  }

  getCountriesWithPersons() {
    return this.http.get<IResponse<ICountry[]>>(environment.apiUrl + '/countries-with-persons')
  }

  getCitiesWithPersonsByCountryId(countryId: number) {
    return this.http.get<IResponse<ICity[]>>(environment.apiUrl + '/cities-with-persons-by-country/' + countryId);
  }


}
