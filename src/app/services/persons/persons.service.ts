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

  constructor(private http: HttpClient, private cacheService: CacheService) {
  }

  activeCountrySlug = '';
  activeCitySlug = '';

  // Check if cache exist
  getFromCache(keyString: string): Observable<any> | null {
    let cache = this.cacheService.getCache(keyString)?.data;
    if (cache != undefined) {
      return of(cache);
    }
    return null;
  }

  // Get persons Index page
  getPersonsDto(limit = 20, offset = 0): Observable<IResponse<BaseListingDto<PersonDto>>> {

    // Cache key
    let keyString = 'persons-index-' + limit + '-' + offset;

    // try to get from cache
    let cache = this.getFromCache(keyString);
    if (cache) return cache;

    let params = new HttpParams();
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }


    // Get data from server and set it to cache
    return this.http
      .get<IResponse<BaseListingDto<PersonDto>>>(environment.apiUrl + '/persons',
        {params})
      .pipe(map(
        value => {
          this.cacheService.setCache(keyString, value);
          return value;
        }));
  }

  // get persons by user id
  getPersonsDtoByUser(limit: number = 20, offset: number = 0): Observable<IResponse<BaseListingDto<PersonDto>>> {

    let params = new HttpParams();
    if (limit != 20) {
      params = params.append('limit', limit)
    }

    if (offset != 0) {
      params = params.append('offset', offset)
    }

    return this.http
      .get<IResponse<BaseListingDto<PersonDto>>>(environment.apiUrl + '/account/persons-by-user',
        {params});
  }

  // Get single person
  getSinglePersonDto(id: number): Observable<IResponse<PersonDto>> {
    let keyString = 'person-single-model-' + id;

    // try to get from cache
    let cache = this.getFromCache(keyString);
    if (cache) return cache;


    return this.http
      .get<IResponse<PersonDto>>(environment.apiUrl + '/person/' + id)
      .pipe(map(value => {
        this.cacheService.setCache(keyString, value)
        return value;
      }));
  }

  // get persons index page with country
  getPersonsByCountry(countrySlug: string, limit: number = 20, offset: number = 0) {

    // Cache key
    let keyString = `persons-index-${countrySlug}-${limit}-${offset}`;

    // try to get from cache
    let cache = this.getFromCache(keyString);
    if (cache) return cache;

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
      .pipe(map(value => {
        this.cacheService.setCache(keyString, value);
        return value;
      }))
  }

  // get persons index page with country and city
  getPersonsByCountryAndCity(countrySlug: string, citySlug: string, limit: number = 20, offset: number = 0) {

    // Cache key
    let keyString = `persons-index-${countrySlug}-${citySlug}-${limit}-${offset}`;

    // try to get cache
    let cache = this.getFromCache(keyString);
    if (cache) return cache;

    let params = new HttpParams();
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }

    return this.http
      .get<IResponse<BaseListingDto<IPerson>>>(environment.apiUrl + '/persons/' + countrySlug + '/' + citySlug,
        {params})
      .pipe(map(value => {
        this.cacheService.setCache(keyString, value);
        return value;
      }))
  }

  sendMessage(form: any): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(environment.apiUrl + '/persons/send-message',
      JSON.stringify(form))

  }

  // Create person
  addPerson(formData: FormData) {
    return this.http.post<IResponse<PersonDto>>(environment.apiUrl + '/account/person/add',
      formData)
  }

  // Edit person inside account
  getPersonEditBase(id: number): Observable<IResponse<IPerson>> {
    return this.http.get<IResponse<IPerson>>(environment.apiUrl + '/account/person/edit/' + id)
  }


  deletePerson(id: number) {
    return this.http.delete<IResponse<any>>(environment.apiUrl + '/account/person/' + id)
  }
}
