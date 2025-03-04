import { CheckIcon } from "@radix-ui/react-icons";
import { useDictionary } from "../utils/contexts/dictionaryContext";
import { Menu, MenuItem, Popover, PopoverProps } from "react-aria-components";
import { LocaleEnum } from "@/types/langsEnum";

interface SelectorProps extends Omit<PopoverProps, "setLanguage"> {
  setLanguage: (lang: keyof typeof LocaleEnum) => void;
}

export default function LangSelector({ setLanguage, ...props }: SelectorProps) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;

  return (
    <Popover
      {...props}
      className="p-1.5 rounded-xl bg-white shadow-md z-30 border border-black/10 hover:border-black/20 transition-color text-nowrap select-none ring-0"
    >
      <Menu className="flex flex-col outline-none gap-1">
        {Object.entries(LocaleEnum).map(([key, value]) => {
          const isCurrentLang = lang === key;
          return (
            <MenuItem
              key={key}
              onAction={() => setLanguage(key as keyof typeof LocaleEnum)}
              className={`px-2.5 rounded-md py-0.5 focus:bg-blue-400/10 focus:outline-none flex justify-between items-center gap-5 ${
                isCurrentLang ? "" : "cursor-pointer"
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
