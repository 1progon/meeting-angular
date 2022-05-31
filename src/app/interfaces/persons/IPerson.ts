import {IBaseModel} from "../IBaseModel";
import {IPersonChar} from "./IPersonChar";
import {ICountry} from "../location/ICountry";
import {IRegion} from "../location/IRegion";
import {ICity} from "../location/ICity";
import {IPersonPhone} from "./IPersonPhone";

export interface IPerson extends IBaseModel {

  chars: IPersonChar;
  description: string;
  image: string;
  status: number;
  country: ICountry;
  region: IRegion;
  city: ICity;
  phones: IPersonPhone[];
  images: IPersonPhone[];
}
