import "server-only";
import { CountryDataType } from "@/types/countryData";
import { CountryEnum } from "@/types/countriesEnum";

const datas = {
  france: () => import("../../data/france.js").then((module) => module.default)
};

export const getCountryData = async (
  country: keyof typeof CountryEnum
): Promise<CountryDataType> => datas[country]();
