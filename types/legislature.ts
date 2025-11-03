import { PartyType } from "./party";

export type LegislatureType = {
  legislature: number;
  total_deputies: number;
  duration?: number;
  begin: string;
  end: string;
  parties: PartyType[];
  source?: string[];
};
