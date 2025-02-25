import { CurrentType } from "./current";

export type PartyType = {
  name: string;
  full_name?: string;
  keyword?: string;
  deputes?: number;
  current?: CurrentType;
  coalition?: string;
  persons?: string[];
  source?: string[];
};
