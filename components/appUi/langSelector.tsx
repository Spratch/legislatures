"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { useDictionary } from "../utils/contexts/dictionaryContext";
import {
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  PopoverProps
} from "react-aria-components";
import { LocaleEnum } from "@/types/langsEnum";
import { useState } from "react";
import SettingsButton from "./settingsButton";
import { EarthGlobeIcon } from "@sanity/icons";
import { usePathname, useRouter } from "next/navigation";

export default function LangSelector({ ...props }: PopoverProps) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const setLanguage = (lang: keyof typeof LocaleEnum) => {
    if (pathName.split("/").length > 2) {
      const newPath = pathName.replace(/\/[a-z]{2}\//, `/${lang}/`);
      router.replace(newPath, { scroll: false });
    } else {
      router.push(lang);
    }
  };

  return (
    <MenuTrigger
      isOpen={isSelectorOpen}
      onOpenChange={setSelectorOpen}
    >
      <SettingsButton
        Icon={EarthGlobeIcon}
        label={dictionary.infosModal.changeLang}
        position={{ x: "right", y: "top" }}
        onClick={() => setSelectorOpen(true)}
        kbd="l"
      />
      <Popover
        {...props}
        className="transition-color z-30 select-none text-nowrap rounded-xl border border-black/20 bg-white p-1.5 shadow-md ring-0"
      >
        <Menu className="flex flex-col gap-1 outline-none">
          {Object.entries(LocaleEnum).map(([key, value]) => {
            const isCurrentLang = lang === key;
            return (
              <MenuItem
                key={key}
                onAction={() => setLanguage(key as keyof typeof LocaleEnum)}
                className={`flex items-center justify-between gap-5 rounded-md px-2.5 py-0.5 focus:bg-black/30 focus:text-white focus:outline-none ${
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
    </MenuTrigger>
  );
}
