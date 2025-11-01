import "../../globals.css";
import { getCountryData } from "./countryConfig";
import Providers from "@/utils/contexts/providers";
import { LocaleEnum } from "@/types/langsEnum";
import { CountryEnum } from "@/types/countriesEnum";
import { getDictionary } from "../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { lang: keyof typeof LocaleEnum; country: keyof typeof CountryEnum };
}): Promise<Metadata> {
  const dict = (await getDictionary(params.lang)).home;
  const title = `${dict.meta_title}, ${dict[`title_${params.country}`]}`;
  const description = `${dict.meta_description} (${dict[`description_${params.country}`]})`;
  const url = `https://${process.env.NEXT_PUBLIC_HOST_NAME}/${params.lang}/${params.country}`;

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
}: {
  children: React.ReactNode;
  params: { country: keyof typeof CountryEnum };
}) {
  const countryData = await getCountryData(params.country);
  return <Providers countryData={countryData}>{children}</Providers>;
}
