import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  isLogged = false;

  ngOnInit(): void {
    this.isLogged = this.authService.isLogged()
    if (this.isLogged) {
      this.router.navigateByUrl('/persons').finally()
      return
    }

    this.authService.updateTokenEvent
      .subscribe((x) => {
        this.isLogged = x;
      })
  }


}
