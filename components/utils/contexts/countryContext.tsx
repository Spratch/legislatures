"use client";

import { CountryDataType } from "@/types/countryData";
import { createContext, useContext } from "react";

interface CountryDataContextType {
  countryData: CountryDataType | null;
}

// Create context for country data
const CountryDataContext = createContext<CountryDataContextType | undefined>(
  undefined
);

// Create a hook to use the country data context
export const useCountryDataContext = () => {
  const context = useContext(CountryDataContext);
  if (!context) {
    throw new Error(
      "useCountryDataContext must be used within a CountryDataProvider"
    );
  }
  return context;
};

// Create a provider for the country data context
export const CountryDataProvider = ({
  children,
  countryData
}: {
  children: React.ReactNode;
  countryData: CountryDataType;
}) => {
  return (
    <CountryDataContext.Provider value={{ countryData }}>
      {children}
    </CountryDataContext.Provider>
  );
};
