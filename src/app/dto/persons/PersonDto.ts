import {IPersonPhone} from "../../interfaces/persons/IPersonPhone";
import {IPersonImage} from "../../interfaces/persons/IPersonImage";
import {IPersonService} from "../../interfaces/persons/IPersonService";
import {PersonCharDto} from "./PersonCharDto";
import {IPersonRate} from "../../interfaces/persons/IPersonRate";

export interface PersonDto {
  id: number;
  name: string;
  slug: string;
  person_char: PersonCharDto;
  description: string;
  image: string;
  country_name: string;
  region_name: string;
  city_name: string;
  phones: IPersonPhone[];
  images: IPersonImage[];
  services: IPersonService[];
  rates: IPersonRate[];
  rates_ids: number[];
}



