import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BaseListingDto} from "../../dto/BaseListingDto";
import {IPerson} from "../../interfaces/persons/IPerson";
import {map, Observable, of} from "rxjs";
import {IResponse} from "../../interfaces/IResponse";
import {PersonDto} from "../../dto/persons/PersonDto";
import {CacheService} from "../cache.service";

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(private http: HttpClient, private cache: CacheService) {
  }

  getPersons(limit = 20, offset = 0): Observable<IResponse<BaseListingDto<IPerson>>> {

    // Cache key
    let keyString = 'persons-index-' + limit + '-' + offset;

    // get cache
    let cache = this.cache.getCache(keyString)?.data;
    if (cache != undefined) {
      return of(cache);
    }

    let params = new HttpParams();
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }


    // Get data from server and set it to cache
    return this.http
      .get<IResponse<BaseListingDto<IPerson>>>(environment.apiUrl + '/persons',
        {params})
      .pipe(map(
        value => {
          this.cache.setCache(keyString, value);
          return value;
        }));
  }

  // Frontend
  getPersonDto(id: number): Observable<IResponse<PersonDto>> {
    let keyGen = 'person-single-model-' + id;

    let cache = this.cache.getCache(keyGen)?.data;
    if (cache != undefined) {
      return of(cache);
    }

    return this.http
      .get<IResponse<PersonDto>>(environment.apiUrl + '/person/' + id)
      .pipe(map(value => {
        this.cache.setCache(keyGen, value)
        return value;
      }));
  }

  // Edit person inside account
  getPersonEditBase(id: number): Observable<IResponse<IPerson>> {
    // todo not implemented get person
    return this.http.get<IResponse<IPerson>>('')
  }

  getPersonsByCountry(countrySlug: string, limit: number = 20, offset: number = 0) {

    let params = new HttpParams();
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }

    return this.http
      .get<IResponse<BaseListingDto<IPerson>>>(environment.apiUrl + '/persons/' + countrySlug,
        {params})
  }

  getPersonsByCountryAndCity(countrySlug: string, citySlug: string, limit: number = 20, offset: number = 0) {

    let params = new HttpParams();
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }

    return this.http.get<IResponse<BaseListingDto<IPerson>>>(environment.apiUrl + '/persons/' + countrySlug + '/' + citySlug,
      {params})
  }

  sendMessage(form: any): Observable<IResponse<any>> {
    console.log(form)
    return this.http.post<IResponse<any>>(environment.apiUrl + '/persons/send-message',
      JSON.stringify(form))

  }


}
