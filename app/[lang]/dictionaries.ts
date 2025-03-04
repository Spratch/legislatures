import { DictionaryType } from "@/components/utils/contexts/dictionaryContext";
import { LocaleEnum } from "@/types/langsEnum";
import "server-only";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default)
};

export const getDictionary = async (
  locale: keyof typeof LocaleEnum
): Promise<DictionaryType> => dictionaries[locale]();
