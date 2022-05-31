import {IPersonPhone} from "../../interfaces/persons/IPersonPhone";
import {IPersonImage} from "../../interfaces/persons/IPersonImage";
import {PersonCharDto} from "./PersonCharDto";

export interface PersonDto {
  id: number;
  name: string;
  slug: string;
  person_char: PersonCharDto;

  status: number;
  status_name: string;

  description: string;
  image: string;
  country_name: string;
  region_name: string;
  city_name: string;
  phones: IPersonPhone[];
  images: IPersonImage[];
}



