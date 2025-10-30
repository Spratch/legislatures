import { GitHubLogoIcon } from "@radix-ui/react-icons";
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
  const dict = useDictionary().infosModal;
  return (
    <section className="sticky top-0 z-10 mx-auto flex w-full max-w-screen-3xl items-end bg-opacity-45 bg-gradient-to-b from-white via-white/70 to-transparent p-2 pb-4">
      <div className="flex w-full justify-center gap-2">
        <div className="flex items-center gap-2">
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
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
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
