import {Component, OnInit} from '@angular/core';
import {RegisterDto} from "../../../dto/auth/RegisterDto";
import {AuthService} from "../../../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {IErrorResponse} from "../../../interfaces/IErrorResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {
  }

  form: RegisterDto = <RegisterDto>{};
  error?: IErrorResponse;
  interval: number = 0;

  passLength = 5;
  showPassword = false;


  ngOnInit(): void {

    // Redirect to account, if user already logged
    if (this.auth.isLogged()) {
      this.router.navigateByUrl('/account').finally();
    }
  }

  setError(error: IErrorResponse) {
    this.error = error;
    clearTimeout(this.interval);

    this.interval = setTimeout(() => {
      this.error = undefined;
    }, 2500)
  }

  submitForm() {
    if (this.form.password.trim() == ''
      || this.form.password_confirm.trim() == ''
      || this.form.email.trim() == '') {

      this.setError({
        data: 'Email, password or password confirm is empty ',
      })
      return;
    }

    if (this.form.password.trim() !== this.form.password_confirm.trim()) {
      this.setError({
        data: 'Passwords do not match',
      })

      return;
    }

    this.auth.register(this.form)
      .subscribe({
        next: () => {

          this.router.navigateByUrl('/account').finally()
          return

        }, error: (err: HttpErrorResponse) => {
          this.setError(err.error)
        }
      })
  }
}
