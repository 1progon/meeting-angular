import {ILanguage} from "./ILanguage";
import {INationality} from "../INationality";

export interface IPersonChar {

  id: number;
  age: number;
  height: number;
  weight: number;
  gender: string;
  ethnicity: string;
  hair_color: string;
  hair_length: string;
  breast_size: string;
  breast_type: string;
  available_for: string;
  nationality: INationality;
  travel: string;
  languages: ILanguage[];
  languages_ids: number[];
  smoker: string;
  eye_color: string;
  orientation: string;
  pubic_hair: string;
  porn_star: boolean;
  meeting_with: string;
  website: string;
  person_id: number;
}
