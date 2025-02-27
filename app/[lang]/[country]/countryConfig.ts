import "server-only";
import { CountryType } from "@/types/country";

export enum CountryEnum {
  "france" = "france"
}

const datas = {
  france: () => import("../../data/france.js").then((module) => module.default)
};

export const getCountryData = async (
  country: CountryEnum
): Promise<CountryType> => datas[country]();
