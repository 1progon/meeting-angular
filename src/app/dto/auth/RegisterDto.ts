import {AccountType} from "../../enums/AccountType";

export interface RegisterDto {
  email: string;
  password: string;
  password_confirm: string;
  phone: string;
  account_type: AccountType;
}
