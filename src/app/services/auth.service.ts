import {EventEmitter, Injectable, Output} from '@angular/core';
import {RegisterDto} from "../dto/auth/RegisterDto";
import {LoginDto} from "../dto/auth/LoginDto";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IResponse} from "../interfaces/IResponse";
import {TokenDto} from "../dto/user/TokenDto";
import {UserType} from "../enums/UserType";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() updateTokenEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
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

    if (!jsonToken) {
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

  logout() {
    this._token = undefined;
    this.clearTokenStorage();
    this.updateTokenEvent.emit(false)
  }
}
