import {IBaseLocation} from "./IBaseLocation";

export interface ICity extends IBaseLocation{
  region_id: number;
  country_id: number;
  persons_count: number;
}
