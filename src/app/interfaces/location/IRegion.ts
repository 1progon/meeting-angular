import {IBaseLocation} from "./IBaseLocation";
import {ICity} from "./ICity";

export interface IRegion extends IBaseLocation {
  country_id: number;
  cities?: ICity[];
}


