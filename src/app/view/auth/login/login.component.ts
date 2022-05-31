import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {LoginDto} from "../../../dto/auth/LoginDto";
import {Router} from "@angular/router";
import {IErrorResponse} from "../../../interfaces/IErrorResponse";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {
  }

  form: LoginDto = {} as LoginDto;
  error?: IErrorResponse;
  timeoutId: ReturnType<typeof setTimeout> = 0;
  passLength = 5;
  showPassword = false;

  ngOnInit(): void {
    if (this.auth.isLogged()) {
      this.router.navigateByUrl('/account').finally();
      return
    }

  }

  setError(error: IErrorResponse) {
    this.error = error;
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.error = undefined;
    }, 2500)
  }

  submitForm() {
    if (this.form.password.trim() == '' || this.form.email.trim() == '') {
      this.setError({
        data: 'Password or email is empty'
      })
      return;
    }

    this.auth.login(this.form)
      .subscribe({
        next: () => {

          this.router.navigateByUrl('/persons').finally()
          return;
        },
        error: err => {
          console.error(err);
          this.setError(err.error);
        }
      })
  }
}
