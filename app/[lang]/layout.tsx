import { Locale, LocaleEnum } from "@/types/langsEnum";
import { DictionaryProvider } from "@/utils/contexts/dictionaryContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { getDictionary } from "./dictionaries";

export function isLocale(value: string): value is Locale {
  return value in LocaleEnum;
}

export async function generateMetadata({
  params
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    throw new Error(`Invalid locale: ${lang}`);
  }
  const dict = (await getDictionary(lang)).home;
  const title = dict.meta_title;
  const description = dict.meta_description + dict.meta_multi;
  const url = `https://${process.env.NEXT_PUBLIC_HOST_NAME}/${lang}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://${process.env.NEXT_PUBLIC_HOST_NAME}`,
      languages: Object.entries(LocaleEnum).reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: `https://${process.env.NEXT_PUBLIC_HOST_NAME}/${key}`
        }),
        {}
      )
    },
    openGraph: {
      title,
      description,
      url
    }
  };
}

export default async function RootLayout({
  children,
  params
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    throw new Error(`Invalid locale: ${lang}`);
  }
  const dict = await getDictionary(lang);

  return (
    <html lang={lang || "fr"}>
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
