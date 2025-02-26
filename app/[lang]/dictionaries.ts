import "server-only";

export enum LocaleEnum {
  "fr" = "fr",
  "en" = "en",
  "de" = "de"
}

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default)
};

export const getDictionary = async (locale: LocaleEnum) =>
  dictionaries[locale]();
