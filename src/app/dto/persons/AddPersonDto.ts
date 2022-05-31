import {IPerson} from "../../interfaces/persons/IPerson";

export interface AddPersonDto {
  person_dto: IPerson;
  image_file: File;
}

