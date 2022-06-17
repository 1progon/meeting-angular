import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BaseListingDto} from "../../dto/BaseListingDto";
import {IPerson} from "../../interfaces/persons/IPerson";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {IResponse} from "../../interfaces/IResponse";
import {PersonDto} from "../../dto/persons/PersonDto";
import {CacheService} from "../cache.service";

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(private http: HttpClient, private cacheService: CacheService) {
  }

  // Check if cache exist
  getFromCache(keyString: string): any | null {
    let cache = this.cacheService.getCache(keyString)?.data;
    if (cache) {
      return cache;
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
    let cacheName: string = `persons-index-${limit}-${offset}`;

    // Add query params
    if (offset != 0) {
      params = params.append("offset", offset);
    }
    if (limit != 20) {
      params = params.append("limit", limit);
    }

    // Add filters to query params
    let countryId = filters?.get('country');
    if (countryId) {
      params = params.append('country', countryId);
      cacheName += `-${countryId}`;

    }
    let cityId = filters?.get('city');
    if (cityId) {
      params = params.append('city', cityId);
      cacheName += `-${cityId}`;
    }

    let gender = filters?.get('gender');
    if (gender) {
      params = params.append('gender', gender);
      cacheName += `-${gender}`;
    }

    let ageFrom = filters?.get('ageFrom');
    if (ageFrom) {
      params = params.append('ageFrom', ageFrom);
      cacheName += `-${ageFrom}`;
    }

    let ageTo = filters?.get('ageTo');
    if (ageTo) {
      params = params.append('ageTo', ageTo);
      cacheName += `-${ageTo}`;
    }

    // try to get data from local cache
    let cache = this.getFromCache(cacheName);
    if (cache) return of(cache);

    // Get data from server and set it to cache
    let url = environment.apiUrl + '/persons';
    return this.http
      .get<IResponse<BaseListingDto<PersonDto>>>(url, {params})
      .pipe(
        map(
          value => {
            this.cacheService.setCache(cacheName, value);
            return value;
          }),
        catchError((err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.cacheService.setCache(cacheName, {} as IResponse<BaseListingDto<PersonDto>>);
          }
          return throwError(() => err);
        }),
      );
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
    let cacheName = `person-single-model-${id}`;

    // try to get from cache
    let cache = this.getFromCache(cacheName);
    if (cache) {
      return of(cache);
    }

    return this.http
      .get<IResponse<PersonDto>>(environment.apiUrl + '/person/' + id)
      .pipe(map(value => {
        this.cacheService.setCache(cacheName, value)
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
