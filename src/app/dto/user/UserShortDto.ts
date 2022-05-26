import {AccountType} from "../../enums/AccountType";
import {UserType} from "../../enums/UserType";

export interface UserShortDto {
  guid: string;
  email: string;
  phone: string;
  token_dto: {
    token: string;
    token_expired: number
    account_type: AccountType;
    user_type: UserType;
    refresh_token: string;
  }
}


