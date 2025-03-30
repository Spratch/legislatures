import { PartyType } from "./party";

export type CurrentType = {
  name: string;
  name_en?: string;
  name_de?: string;
  color: string;
  keyword?: string;
  parties: PartyType[];
  source?: string[];
};
