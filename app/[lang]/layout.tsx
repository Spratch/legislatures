import "../globals.css";
import { Monitoring } from "react-scan/monitoring/next";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "./dictionaries";
import { LocaleEnum } from "@/types/langsEnum";
import { DictionaryProvider } from "@/utils/contexts/dictionaryContext";

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
          src="https://unpkg.com/react-scan/dist/install-hook.global.js"
          strategy="beforeInteractive"
        />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="cc67e312-aaf6-4e72-bf1d-fca4ba4258de"
        />
      </head>
      <body className="overscroll-none">
        <Monitoring
          apiKey="WciccaRIHNoiwSM-Q0Cj9spQfSAdfINb" // Safe to expose publically
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
          branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}
        />
        <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
