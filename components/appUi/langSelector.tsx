import { CheckIcon } from "@radix-ui/react-icons";
import { useDictionary } from "../utils/contexts/dictionaryContext";
import { Menu, MenuItem, Popover } from "react-aria-components";
import { LocaleEnum } from "@/types/langsEnum";

type Props = {
  setLanguage: (lang: keyof typeof LocaleEnum) => void;
};

export default function LangSelector({ setLanguage }: Props) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;

  return (
    <Popover className="py-2 rounded-xl bg-white shadow-md z-30 border border-black/10 hover:border-black/20 transition-color text-nowrap select-none ring-0">
      <Menu className="flex flex-col outline-none">
        {Object.entries(LocaleEnum).map(([key, value]) => {
          const isCurrentLang = lang === key;
          return (
            <MenuItem
              key={key}
              onAction={() => setLanguage(key as keyof typeof LocaleEnum)}
              className={`px-3 py-0.5 focus:bg-black/10 focus:outline-none flex justify-between items-center gap-5 ${
                isCurrentLang ? "bg-blue-400/20" : ""
              }`}
              isDisabled={isCurrentLang}
            >
              {value}
              {isCurrentLang && <CheckIcon className="size-5" />}
            </MenuItem>
          );
        })}
      </Menu>
    </Popover>
  );
}
