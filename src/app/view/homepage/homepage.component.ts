import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  isLogged = false;

  ngOnInit(): void {
    this.isLogged = this.authService.isLogged()

    this.authService.updateTokenEvent
      .subscribe((x) => {
        this.isLogged = x;
      })
  }


}
