import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "./dictionaries";
import { LocaleEnum } from "@/types/langsEnum";
import { DictionaryProvider } from "@/utils/contexts/dictionaryContext";

export async function generateMetadata({
  params
}: {
  params: { lang: keyof typeof LocaleEnum };
}) {
  const dict = (await getDictionary(params.lang)).home;
  const title = dict.meta_title;
  const description = dict.meta_description + dict.meta_multi;
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
      url: "https://legislatures.josephclenet.fr"
    }
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: keyof typeof LocaleEnum };
}) {
  // Get the dictionary for the current locale
  const dict = await getDictionary(params.lang);

  return (
    <html lang={params.lang || "fr"}>
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="cc67e312-aaf6-4e72-bf1d-fca4ba4258de"
        />
      </head>
      <body className="overscroll-none">
        <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
