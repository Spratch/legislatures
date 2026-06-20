import { Country, CountryEnum } from "@/types/countriesEnum";
import Providers from "@/utils/contexts/providers";
import { Metadata } from "next";
import "../../globals.css";
import { getDictionary } from "../dictionaries";
import { isLocale } from "../layout";
import { getCountryData } from "./countryConfig";

function isCountry(value: string): value is Country {
  return value in CountryEnum;
}

export async function generateMetadata({
  params
}: LayoutProps<"/[lang]/[country]">): Promise<Metadata> {
  const { lang, country } = await params;
  if (!isCountry(country)) {
    throw new Error(`Invalid country: ${country}`);
  }
  if (!isLocale(lang)) {
    throw new Error(`Invalid locale: ${lang}`);
  }
  const dict = (await getDictionary(lang)).home;
  const title = `${dict.meta_title}, ${dict[`title_${country}`]}`;
  const description = `${dict.meta_description} (${dict[`description_${country}`]})`;
  const url = `https://${process.env.NEXT_PUBLIC_HOST_NAME}/${lang}/${country}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url
    }
  };
}

export default async function CountryLayout({
  children,
  params
}: LayoutProps<"/[lang]/[country]">) {
  const { country } = await params;
  if (!isCountry(country)) {
    throw new Error(`Invalid country: ${country}`);
  }
  const countryData = await getCountryData(country);
  return <Providers countryData={countryData}>{children}</Providers>;
}
