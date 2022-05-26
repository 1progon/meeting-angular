import {UserType} from "../../enums/UserType";
import {AccountType} from "../../enums/AccountType";

export interface TokenDto {
  access_token: string;
  token_expired: number;
  account_type: AccountType;
  user_type: UserType;
  refresh_token: string;
}

