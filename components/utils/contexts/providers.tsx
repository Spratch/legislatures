"use client";

import { CountryDataType } from "@/types/countryData";
import { CountryDataProvider } from "./countryContext";
import { VisibleCurrentsProvider } from "./currentsContext";
import { Provider as AtomsProvider } from "jotai";

type Props = {
  children: React.ReactNode;
  countryData: CountryDataType;
};

export default function Providers({ children, countryData }: Props) {
  return (
    <CountryDataProvider countryData={countryData}>
      <VisibleCurrentsProvider countryData={countryData}>
        <AtomsProvider>{children}</AtomsProvider>
      </VisibleCurrentsProvider>
    </CountryDataProvider>
  );
}
