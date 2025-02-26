import { LegislatureType } from "./legislature";

export type RegimeType = {
  name: string;
  name_en?: string;
  name_de?: string;
  begin?: string;
  end?: string;
  legislatures: LegislatureType[];
  source?: string[];
};
