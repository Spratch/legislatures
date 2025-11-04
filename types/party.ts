import { CurrentType } from "./current";

export type PartyType = {
  name: string;
  full_name?: string;
  full_name_en?: string;
  full_name_de?: string;
  keyword?: string;
  deputies?: number;
  current?: CurrentType;
  coalition?: string;
  coalition_en?: string;
  coalition_de?: string;
  source?: string[];
  isMostImportantEntity?: boolean;
};
