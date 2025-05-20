import "../../globals.css";
import { getCountryData } from "./countryConfig";
import Providers from "@/utils/contexts/providers";
import { LocaleEnum } from "@/types/langsEnum";
import { CountryEnum } from "@/types/countriesEnum";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({
  params
}: {
  params: { lang: keyof typeof LocaleEnum; country: keyof typeof CountryEnum };
}) {
  const dict = (await getDictionary(params.lang)).home;
  const title = dict.meta_title + `, ${dict[`title_${params.country}`]}`;
  const description =
    dict.meta_description + ` (${dict[`description_${params.country}`]})`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: "/",
      languages: Object.entries(LocaleEnum).reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: `/${key}`
        }),
        {}
      )
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://legislatures.vercel.app"
    }
  };
}

export default async function CountryLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { country: keyof typeof CountryEnum };
}) {
  // Get the data for the current country
  const countryData = await getCountryData(params.country);

  return <Providers countryData={countryData}>{children}</Providers>;
}
