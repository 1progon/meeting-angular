import {IBaseLocation} from "./IBaseLocation";
import {IRegion} from "./IRegion";
import {ICity} from "./ICity";

export interface ICountry extends IBaseLocation {
  regions?: IRegion[];
  cities?: ICity[];
  persons_count: number;
}
