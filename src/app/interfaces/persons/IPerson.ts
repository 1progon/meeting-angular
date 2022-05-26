import {IBaseModel} from "../IBaseModel";
import {IPersonChar} from "./IPersonChar";
import {ICountry} from "../location/ICountry";
import {IRegion} from "../location/IRegion";
import {ICity} from "../location/ICity";
import {IPersonPhone} from "./IPersonPhone";
import {IPersonService} from "./IPersonService";
import {IPersonRate} from "./IPersonRate";

export interface IPerson extends IBaseModel {

  chars: IPersonChar;
  description: string;
  image: string;
  country: ICountry;
  region: IRegion;
  city: ICity;
  phones: IPersonPhone[];
  images: IPersonPhone[];
  services: IPersonService[];
  rates: IPersonRate[];
  rates_ids: number[];
}
