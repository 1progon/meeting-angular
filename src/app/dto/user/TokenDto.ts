import {UserType} from "../../enums/UserType";

export interface TokenDto {
  access_token: string;
  token_expired: number;
  user_type: UserType;
  refresh_token: string;
}

