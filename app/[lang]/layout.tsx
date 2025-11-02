import { LocaleEnum } from "@/types/langsEnum";
import { DictionaryProvider } from "@/utils/contexts/dictionaryContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { getDictionary } from "./dictionaries";

export async function generateMetadata({
  params
}: {
  params: { lang: keyof typeof LocaleEnum };
}): Promise<Metadata> {
  const dict = (await getDictionary(params.lang)).home;
  const title = dict.meta_title;
  const description = dict.meta_description + dict.meta_multi;
  const url = `https://${process.env.NEXT_PUBLIC_HOST_NAME}/${params.lang}`;

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
}: {
  children: React.ReactNode;
  params: { lang: keyof typeof LocaleEnum };
}) {
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
