"use client";

import CountryThumbnail from "@/components/appUi/countryThumbnail";
import SettingsButton from "@/components/appUi/settingsButton";
import HomeSettingsLine from "@/components/appUi/settingsHome";
import { useDictionary } from "@/components/utils/contexts/dictionaryContext";
import { CountryEnum } from "@/types/countriesEnum";
import { LocaleEnum } from "@/types/langsEnum";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.home;
  const [offset, setOffset] = useState(0);
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const router = useRouter();
  const setLanguage = (lang: keyof typeof LocaleEnum) => {
    router.push(lang);
  };

  // Images wip
  const countries = Object.entries(CountryEnum).map(([key, value]) => ({
    key,
    value,
    title: dict[`title_${key}`],
    description: dict[`description_${key}`],
    image: `/medias/${key}.webp`
  }));
  return (
    <>
      <HomeSettingsLine
        isSelectorOpen={isSelectorOpen}
        setSelectorOpen={setSelectorOpen}
        setLanguage={setLanguage}
      />
      <main className="relative w-full max-w-screen-3xl mx-auto h-[calc(100dvh-3.25rem)] px-5 sm:px-10 pt-5 sm:pt-12 flex flex-col sm:gap-10 overflow-hidden">
        {/* Intro */}
        {dict.title && (
          <div className="flex flex-col gap-2 max-w-prose">
            <h1 className="text-xl sm:text-4xl">{dict.title}</h1>
            <p className="sm:text-xl text-black/50">{dict.description}</p>
          </div>
        )}

        {/* Gallery */}
        <section className="flex flex-col w-full items-center justify-center flex-grow pb-16 sm:pb-0 sm:absolute sm:top-1/2 sm:left-1/2 transform sm:-translate-x-1/2 sm:-translate-y-1/2">
          {countries.map((country, index) => (
            <CountryThumbnail
              key={country.key}
              countryInfos={country}
              index={(index + offset) % countries.length}
              lang={lang}
            />
          ))}
          {countries.length > 1 && (
            <nav className="flex w-full justify-between sm:justify-center z-20 sm:gap-x-[32rem]">
              <SettingsButton
                Icon={ArrowLeftIcon}
                onClick={() =>
                  setOffset((prev) => (prev + 1) % countries.length)
                }
                label={dict.previous}
                position={{ x: "left", y: "bottom" }}
                kbd={"ArrowLeft"}
              />
              <SettingsButton
                Icon={ArrowRightIcon}
                onClick={() =>
                  setOffset(
                    (prev) => (prev - 1 + countries.length) % countries.length
                  )
                }
                label={dict.next}
                position={{ x: "right", y: "bottom" }}
                kbd={"ArrowRight"}
              />
            </nav>
          )}
        </section>
      </main>
    </>
  );
}
