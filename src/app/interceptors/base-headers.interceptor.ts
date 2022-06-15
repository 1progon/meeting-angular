import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError} from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {TokenDto} from "../dto/user/TokenDto";
import {IResponse} from "../interfaces/IResponse";


export let isRefreshing: boolean = false;
export let subj = new BehaviorSubject<null | TokenDto>(null);


@Injectable()
export class BaseHeadersInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute,
              private auth: AuthService) {
  }

  addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        "Authorization": `bearer ${token}`
      }
    })
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!(request.body instanceof FormData)) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
        }
      })
    }

    if (this.auth.isLogged() && this.auth.token) {
      request = this.addTokenHeader(request, this.auth.token.access_token);
    }


    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status == 401 && error.error.data.toLowerCase().trim() == 'token is expired') {
          return this.refreshToken(request, next)
        } else if (error.status == 401) {
          this.auth.logoutAndRedirect();
          return of(<any>error);
        }
        return throwError(() => error);
      }))


  }

  refreshToken(request: HttpRequest<any>, next: HttpHandler) {

    if (!isRefreshing) {
      // start update token
      isRefreshing = true;
      subj.next(null);

      // get new token
      return this.auth.refreshToken()
        .pipe(switchMap((response: IResponse<TokenDto>) => {
            // stop refreshing
            isRefreshing = false;

            // save new token
            this.auth.token = response.data;

            // add token to subject
            subj.next(response.data);

            //return request with headers
            return next.handle(this.addTokenHeader(request, response.data.access_token));
          })
        );
    } else {
      return subj.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          if (token) {
            return next.handle(this.addTokenHeader(request, token.access_token))
          }
          return next.handle(request);

        })
      )
    }


  }
}
