import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {TokenDto} from "../../../dto/user/TokenDto";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private auth: AuthService) {
  }

  user?: TokenDto;

  ngOnInit(): void {
    this.user = this.auth.token;
  }

}
