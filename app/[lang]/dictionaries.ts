import "server-only";
import { DictionaryType } from "@/components/utils/contexts/dictionaryContext";
import { LocaleEnum } from "@/types/langsEnum";

export const getDictionary = async (
  locale: keyof typeof LocaleEnum
): Promise<DictionaryType> => {
  const dictionary = await Promise.resolve(
    import(`./dictionaries/${locale}.json`).then((module) => module.default)
  );
  return dictionary;
};
