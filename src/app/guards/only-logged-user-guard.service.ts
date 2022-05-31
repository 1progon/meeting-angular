import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {UserType} from "../enums/UserType";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OnlyLoggedUserGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // Move out if not logged or if account not user type
    if (!this.auth.isLogged() || this.auth.token?.user_type != UserType.User) {
      this.router.navigateByUrl('/login').finally();
      return false;
    }

    // allow only if user logged and token not expired
    return this.auth.isLogged();
  }

}








