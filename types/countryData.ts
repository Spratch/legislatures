import { EventType } from "./event";
import { FamilyType } from "./family";
import { RegimeType } from "./regime";

export type CountryDataType = {
  events: EventType[];
  families: FamilyType[];
  regimes: RegimeType[];
};
