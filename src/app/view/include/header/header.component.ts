import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() mobileCountriesEvent = new EventEmitter();
  @Input() isShow = false;

  constructor(private authService: AuthService) {
  }

  isLogged: boolean = false;


  ngOnInit(): void {
    this.isLogged = this.authService.isLogged()

    this.authService.updateTokenEvent
      .subscribe((x) => {
        this.isLogged = x;
      })

  }

  showCountries(value: boolean) {
    this.mobileCountriesEvent.emit(value)
  }

}
