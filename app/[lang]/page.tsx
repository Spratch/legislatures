import CountryThumbnail from "@/components/appUi/countryThumbnail";
import HomeSettingsLine from "@/components/appUi/settingsHome";
import { CountryEnum } from "@/types/countriesEnum";
import { getDictionary } from "./dictionaries";
import { LocaleEnum } from "@/types/langsEnum";

export default async function Home({
  params
}: {
  params: { lang: keyof typeof LocaleEnum };
}) {
  const dictionary = await getDictionary(params.lang);
  const dict = dictionary.home;

  const countries = Object.entries(CountryEnum).map(([key, value]) => ({
    key,
    value,
    title: dict[`title_${key}`],
    description: dict[`description_${key}`],
    image: `/medias/${key}.webp`,
    href: `/${dictionary.locale.lang}/${key}`
  }));

  return (
    <>
      <HomeSettingsLine linkTitle={dictionary.infosModal.github} />
      <main className="relative mx-auto flex h-[calc(100dvh-3.75rem)] w-full max-w-screen-3xl flex-col px-5 pt-5 sm:gap-10 sm:px-10 sm:pt-12">
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
            />
          ))}
        </section>
      </main>
    </>
  );
}
