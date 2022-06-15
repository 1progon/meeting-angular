import {EventEmitter, Injectable, Output} from '@angular/core';
import {RegisterDto} from "../dto/auth/RegisterDto";
import {LoginDto} from "../dto/auth/LoginDto";
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IResponse} from "../interfaces/IResponse";
import {TokenDto} from "../dto/user/TokenDto";
import {UserType} from "../enums/UserType";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() updateTokenEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router) {
  }

  private _token?: TokenDto;


  get token(): TokenDto | undefined {
    if (!this._token) {
      this.getTokenFromStorage();
    }
    return this._token;
  }

  set token(token: TokenDto | undefined) {
    this._token = token;
    this.saveTokenToStorage()
  }

  private saveTokenToStorage() {
    sessionStorage.setItem('token', JSON.stringify(this._token))
  }


  private getTokenFromStorage() {
    let jsonToken = sessionStorage.getItem('token');

    if (!jsonToken || jsonToken.trim() == "") {
      this.logout();
      return;
    }

    let token: TokenDto | undefined = JSON.parse(jsonToken);


    // Check if some important fields empty or undefined in storage
    if (!token
      || token.access_token == undefined
      || token.access_token.trim() == ""
      || token.token_expired == undefined
      || token.token_expired <= 0
      || token.user_type == undefined
      || token.user_type == UserType.Undefined
      || token.refresh_token == undefined
      || token.refresh_token.trim() == ""
    ) {
      this.logout();
      return;
    }

    return this._token = token;
  }

  private clearTokenStorage() {
    sessionStorage.removeItem('token')
  }


  login(form: LoginDto): Observable<IResponse<TokenDto>> {
    return this.http
      .post<IResponse<TokenDto>>(environment.apiUrl + '/auth/login',
        JSON.stringify(form))
      .pipe(map(response => {

        this._token = response.data;
        this.saveTokenToStorage();
        this.updateTokenEvent.emit(true)
        return response;
      }))
  }

  register(form: RegisterDto): Observable<IResponse<TokenDto>> {
    return this.http
      .post<IResponse<TokenDto>>(environment.apiUrl + '/auth/register',
        JSON.stringify(form))
      .pipe(map(response => {

        this._token = response.data;
        this.saveTokenToStorage()
        this.updateTokenEvent.emit(true)
        return response;
      }))
  }

  isLogged(): boolean {
    // Check token in memory, if not exist, parse from storage
    if (!this._token) {
      this.getTokenFromStorage();
    }

    // Check again after parse from storage
    return !!this._token;
  }

  isTokenExpired(): boolean {
    if (!this._token) {
      this.getTokenFromStorage();
    }

    let expired = this._token?.token_expired ?? -1;
    return expired < Math.round(Date.now() / 1000);

  }

  logoutAndRedirect() {
    this.logout();
    this.router.navigateByUrl('/login').finally();
  }

  logout() {
    this._token = undefined;
    this.clearTokenStorage();
    this.updateTokenEvent.emit(false);
  }

  refreshToken() {
    // get ref token from auth tokens
    let refresh_token = this.token?.refresh_token;

    //check if ref token exists
    if (!refresh_token) {
      //logout if no ref token
      this.logoutAndRedirect();
      return of(<IResponse<TokenDto>>{});
    }

    // create json body for request
    let body = JSON.stringify(<TokenDto | unknown>{refresh_token});

    return this.http.post<IResponse<TokenDto>>(environment.apiUrl + '/auth/refresh-token', body);
  }
}
