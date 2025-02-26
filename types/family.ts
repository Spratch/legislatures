import { CurrentType } from "./current";

export type FamilyType = {
  name: string;
  name_en?: string;
  name_de?: string;
  color: string;
  currents: CurrentType[];
};
