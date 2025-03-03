import { EventType } from "./event";
import { FamilyType } from "./family";
import { LocaleEnum } from "./langsEnum";
import { RegimeType } from "./regime";

export type PortableTextType = Array<{
  children?: Array<{
    marks?: Array<string>;
    text?: string;
    _type: string;
    _key: string;
  }>;
  style?: string;
  listItem?: "bullet" | "number";
  markDefs?: Array<{
    href?: string;
    _type: string;
    _key: string;
  }>;
  level?: number;
  _type: string;
  _key: string;
}>;

type ArticlesKeys = `portable_text${
  | ""
  | `_${Lowercase<Exclude<keyof typeof LocaleEnum, "fr">>}`}`;

type InfosType = {
  sections: {
    id: string;
    strings?: {
      [key: string]: string;
    }[];
    articles?: {
      [K in ArticlesKeys]?: PortableTextType;
    }[];
  }[];
};

export type CountryDataType = {
  events: EventType[];
  families: FamilyType[];
  infos: InfosType;
  regimes: RegimeType[];
};
