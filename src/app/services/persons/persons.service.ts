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
  getPersons(limit = 20,
             offset = 0,
             filters?: Map<string, any>): Observable<IResponse<BaseListingDto<PersonDto>>> {

    // Query params
    let params = new HttpParams();

    // Cache key
    let cacheName: string = '';

    // try to get from cache
    let cache = this.getFromCache(keyString);
    if (cache) return cache;

    // Add query params
    if (offset != 0) {
      params = params.append("offset", offset);
    }

    if (limit != 20) {
      params = params.append("limit", limit);
    }


    // Get data from server and set it to cache
    let url = environment.apiUrl + '/persons';
    return this.http
      .get<IResponse<BaseListingDto<PersonDto>>>(url, {params})
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

  sendMessage(form: any): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(environment.apiUrl + '/persons/send-message',
      JSON.stringify(form))

  }

  // Create person
  addPerson(formData: FormData) {
    return this.http.post<IResponse<PersonDto>>(environment.apiUrl + '/account/person/add',
      formData)
  }

  // Update person
  updatePerson(formData: FormData, personId: number) {
    return this.http.post<IResponse<PersonDto>>(environment.apiUrl + '/account/person/edit/' + personId,
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
