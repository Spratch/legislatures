import "server-only";
import { CountryDataType } from "@/types/countryData";
import { CountryEnum } from "@/types/countriesEnum";

const datas = {
  france: () => import("../../data/france").then((module) => module.default),
  germany: () => import("../../data/germany").then((module) => module.default),
  ddr: () => import("../../data/ddr").then((module) => module.default)
};

export const getCountryData = async (
  country: keyof typeof CountryEnum
): Promise<CountryDataType> => datas[country]();
