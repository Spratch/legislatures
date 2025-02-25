import { LegislatureType } from "./legislature";

export type RegimeType = {
  name: string;
  begin?: string;
  end?: string;
  legislatures: LegislatureType[];
  source?: string[];
};
