"use client";

import CountryThumbnail from "@/components/appUi/countryThumbnail";
import HomeSettingsLine from "@/components/appUi/settingsHome";
import { useDictionary } from "@/components/utils/contexts/dictionaryContext";
import { CountryEnum } from "@/types/countriesEnum";
import { LocaleEnum } from "@/types/langsEnum";
import { GitHubLogoIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.home;
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const router = useRouter();
  const setLanguage = (lang: keyof typeof LocaleEnum) => {
    router.push(lang);
  };

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
      <main className="relative mx-auto flex h-[calc(100dvh-3.25rem)] w-full max-w-screen-3xl flex-col px-5 pt-5 sm:gap-10 sm:px-10 sm:pt-12">
        {/* Intro */}
        {dict.title && (
          <div className="flex max-w-prose flex-col gap-2">
            <h1 className="text-xl sm:text-4xl">{dict.title}</h1>
            <p className="text-black/50 sm:text-xl">{dict.description}</p>
          </div>
        )}

        {/* Gallery */}
        <section className="grid w-full flex-grow grid-cols-1 content-center items-center justify-center gap-2 pb-16 sm:grid-cols-3 sm:pb-0">
          {countries.map((country, index) => (
            <CountryThumbnail
              key={country.key}
              countryInfos={country}
              lang={lang}
            />
          ))}
          <Link
            href="https://github.com/Spratch/legislatures?tab=readme-ov-file#how-to-contribute"
            target="_blank"
            className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-400 bg-gray-200 bg-opacity-50 opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <PlusCircledIcon className="size-6 text-gray-500 lg:size-8" />
          </Link>
        </section>
      </main>
    </>
  );
}
