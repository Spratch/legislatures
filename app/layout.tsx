import "./globals.css";
import { Monitoring } from "react-scan/monitoring/next";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { VisibleCurrentsProvider } from "../components/utils/contexts/currentsContext";
import { DetailsProvider } from "../components/utils/contexts/detailsContext";
import { TransitionsProvider } from "../components/utils/contexts/transitionsContext";
import { CoalitionsProvider } from "../components/utils/contexts/coalitionsContext";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

const title = "Visualisation des législatures françaises";
const description =
  "Historique des compositions de l'Assemblée nationale depuis 1791";

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: "https://legislatures.vercel.app"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/install-hook.global.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="overscroll-none">
        <Monitoring
          apiKey="WciccaRIHNoiwSM-Q0Cj9spQfSAdfINb" // Safe to expose publically
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
          branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}
        />
        <VisibleCurrentsProvider>
          <DetailsProvider>
            <TransitionsProvider>
              <CoalitionsProvider>{children}</CoalitionsProvider>
            </TransitionsProvider>
          </DetailsProvider>
        </VisibleCurrentsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
