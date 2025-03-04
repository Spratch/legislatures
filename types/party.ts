import { CurrentType } from "./current";

export type PartyType = {
  name: string;
  full_name?: string;
  full_name_en?: string;
  full_name_de?: string;
  keyword?: string;
  keyword_en?: string;
  keyword_de?: string;
  deputes?: number;
  current?: CurrentType;
  coalition?: string;
  coalition_en?: string;
  coalition_de?: string;
  persons?: string[];
  source?: string[];
};
