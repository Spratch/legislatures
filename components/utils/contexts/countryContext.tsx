"use client";

import { CountryType } from "@/types/country";
import { createContext, useContext } from "react";

interface CountryDataContextType {
  countryData: CountryType | null;
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
  countryData: CountryType;
}) => {
  return (
    <CountryDataContext.Provider value={{ countryData }}>
      {children}
    </CountryDataContext.Provider>
  );
};
