import { EventType } from "./event";
import { FamilyType } from "./family";
import { RegimeType } from "./regime";

export type CountryType = {
  events: EventType[];
  families: FamilyType[];
  regimes: RegimeType[];
};
