import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {UserType} from "../enums/UserType";
import {IResponse} from "../interfaces/IResponse";
import {TokenDto} from "../dto/user/TokenDto";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OnlyLoggedUserGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // Move out if not logged or if account not user type
    if (!this.auth.isLogged() || this.auth.token?.user_type != UserType.User) {
      this.router.navigateByUrl('/login').finally();
      return false;
    }

    //Check if token has expired and update it with refresh token first
    if (this.auth.isLogged() && this.auth.isTokenExpired()) {

      let access_token = this.auth.token?.access_token;
      let refresh_token = this.auth.token?.refresh_token;

      let body = JSON.stringify(<TokenDto>{access_token, refresh_token});


      // ref token
      return this.http
        .post<IResponse<TokenDto>>(environment.apiUrl + '/auth/refresh-token', body)
        .pipe(
          map(value => {

            this.auth.token = value.data;
            return this.auth.isLogged() && !this.auth.isTokenExpired();

          })
        );


    }


    // allow only if user logged and token not expired
    return this.auth.isLogged() && !this.auth.isTokenExpired();


  }

}








