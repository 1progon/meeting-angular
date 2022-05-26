import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";


export let isRefresh: boolean = false;


@Injectable()
export class BaseHeadersInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute,
              private auth: AuthService) {
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");

    if (this.auth.isLogged()) {
      headers = headers.set("Authorization", "bearer " + this.auth.token?.access_token);
    }

    return next.handle(request.clone({
      headers
    }));


  }
}
