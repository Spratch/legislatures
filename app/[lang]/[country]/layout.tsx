import "../../globals.css";
import type { Metadata } from "next";
import { getCountryData } from "./countryConfig";
import Providers from "@/utils/contexts/providers";
import { LocaleEnum } from "@/types/langsEnum";
import { CountryEnum } from "@/types/countriesEnum";

const title = "Visualisation des législatures françaises";
const description =
  "Historique des compositions de l'Assemblée nationale depuis 1791";

export const metadata: Metadata = {
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
