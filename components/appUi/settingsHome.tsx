import { GitHubLogoIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { EarthGlobeIcon } from "@sanity/icons";
import SettingsButton from "./settingsButton";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { MenuTrigger } from "react-aria-components";
import LangSelector from "./langSelector";
import { LocaleEnum } from "@/types/langsEnum";
import Link from "next/link";

type Props = {
  isSelectorOpen: boolean;
  setSelectorOpen: (selectorOpen: boolean) => void;
  setLanguage: (lang: keyof typeof LocaleEnum) => void;
};

export default function HomeSettingsLine({
  isSelectorOpen,
  setSelectorOpen,
  setLanguage
}: Props) {
  const dict = useDictionary().settingsLine;
  return (
    <section className="w-full p-2 flex items-end max-w-screen-3xl mx-auto">
      <div className="w-full flex justify-center gap-2">
        {/* Center */}
        <div className="flex gap-2 items-center">
          {/* Lang button */}
          <MenuTrigger
            isOpen={isSelectorOpen}
            onOpenChange={setSelectorOpen}
          >
            <SettingsButton
              Icon={EarthGlobeIcon}
              label={dict.changeLang}
              position={{ x: "left", y: "top" }}
              onClick={() => setSelectorOpen(!isSelectorOpen)}
              kbd="l"
            />
            <LangSelector setLanguage={setLanguage} />
          </MenuTrigger>
          {/* Github button */}
          <Link
            className="size-9 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all"
            href="https://github.com/Spratch/legislatures"
            target="_blank"
            title={dict.github}
          >
            <GitHubLogoIcon className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
