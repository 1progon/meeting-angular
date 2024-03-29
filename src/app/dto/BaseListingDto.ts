import {IPagination} from "../interfaces/IPagination";

export interface BaseListingDto<T> {
  items: T[]
  pagination: IPagination;
  filtered_ids: number[];
}
