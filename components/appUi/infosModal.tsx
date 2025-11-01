import { Cross1Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import IconButton from "./iconButton";
import useKeyPress from "@/utils/hooks/useKeyPress";
import { useDictionary } from "../utils/contexts/dictionaryContext";
import { useCountryDataContext } from "../utils/contexts/countryContext";
import { getLangKey } from "../utils/getLangKey";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "./portableText";
import { MenuTrigger } from "react-aria-components";
import SettingsButton from "./settingsButton";
import { EarthGlobeIcon } from "@sanity/icons";
import LangSelector from "./langSelector";
import { LocaleEnum } from "@/types/langsEnum";

type Props = {
  setInfosVisibility: (value: boolean) => void;
  isSelectorOpen: boolean;
  setSelectorOpen: (selectorOpen: boolean) => void;
  setLanguage: (lang: keyof typeof LocaleEnum) => void;
};

export default function InfosModal({
  setInfosVisibility,
  isSelectorOpen,
  setSelectorOpen,
  setLanguage
}: Props) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.infosModal;
  const { infos } = useCountryDataContext().countryData;

  // Close the modal
  const handleClose = useCallback(() => {
    setInfosVisibility(false);
  }, [setInfosVisibility]);

  // Close on escape key
  useKeyPress("Escape", handleClose);

  // Close on click outside
  const infoModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        infoModalRef.current &&
        !infoModalRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-black/25 p-4 backdrop-blur-sm sm:p-8">
      <div
        ref={infoModalRef}
        className="relative mx-auto h-full w-full max-w-screen-xl overflow-y-scroll rounded-2xl bg-white shadow-lg"
        role="popover"
      >
        <div className="sticky top-0 z-50 flex w-full justify-end gap-2 bg-gradient-to-b from-white p-4">
          {/* Lang button */}
          <MenuTrigger
            isOpen={isSelectorOpen}
            onOpenChange={setSelectorOpen}
          >
            <SettingsButton
              Icon={EarthGlobeIcon}
              label={dict.changeLang}
              position={{ x: "right", y: "top" }}
              onClick={() => setSelectorOpen(true)}
              kbd="l"
            />
            <LangSelector setLanguage={setLanguage} />
          </MenuTrigger>

          {/* Github button */}
          <div className="rounded-full bg-white">
            <Link
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/5 text-black/50 transition-all hover:bg-black/10 hover:text-black"
              href="https://github.com/Spratch/legislatures"
              target="_blank"
              title={dict.github}
            >
              <GitHubLogoIcon className="size-5" />
            </Link>
          </div>

          {/* Close button */}
          <IconButton
            Icon={Cross1Icon}
            label={dict.close}
            onClick={handleClose}
          />
        </div>

        <section className="grid grid-cols-12 gap-6 border-b border-black px-5 pb-14 sm:px-10">
          <h1 className="col-span-12 text-3xl md:col-span-7 md:text-5xl">
            <span className="opacity-40">
              {infos.sections[0].strings[0][getLangKey("title_light", lang)]}
            </span>
            <br />
            {infos.sections[0].strings[1][getLangKey("title_main", lang)]}
          </h1>
          <div className="col-span-12 flex flex-col items-start text-xl md:col-span-5 md:text-2xl">
            <p className="opacity-75">
              {infos.sections[0].strings[2][getLangKey("intro", lang)]}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-6 px-5 sm:px-10">
          <article className="col-span-12 flex max-w-prose flex-col gap-4 border-b border-black py-8 sm:col-span-7">
            <PortableText
              value={
                infos.sections[1].articles[0][getLangKey("portable_text", lang)]
              }
              components={portableTextComponents}
            />
          </article>
          <article className="col-span-12 flex max-w-prose flex-col gap-4 border-b border-black py-8 sm:col-span-5">
            <PortableText
              value={
                infos.sections[1].articles[1][getLangKey("portable_text", lang)]
              }
              components={portableTextComponents}
            />
          </article>
          <article className="col-span-12 flex max-w-prose flex-col gap-4 border-b border-black py-8 sm:col-span-7 sm:border-none sm:pb-0">
            <PortableText
              value={
                infos.sections[2].articles[0][getLangKey("portable_text", lang)]
              }
              components={portableTextComponents}
            />
          </article>
          <article className="col-span-12 flex max-w-prose flex-col justify-between gap-4 pt-8 sm:col-span-5">
            <PortableText
              value={
                infos.sections[2].articles[1][getLangKey("portable_text", lang)]
              }
              components={portableTextComponents}
            />
          </article>
        </section>
        <div className="sticky bottom-0 h-16 w-full bg-gradient-to-t from-white"></div>
      </div>
    </div>
  );
}
