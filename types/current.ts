import { PartyType } from "./party";

export type CurrentType = {
  name: string;
  color: string;
  keyword?: string;
  parties: PartyType[];
  source?: string[];
};
