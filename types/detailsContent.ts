import { CurrentType } from "./current";
import { EventType } from "./event";
import { PartyType } from "./party";

export type DetailsContentType = {
    entity: PartyType | CurrentType | EventType;
    parent?: PartyType | CurrentType;
}
