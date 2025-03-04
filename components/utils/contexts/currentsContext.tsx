"use client";

import { createContext, useContext, useState } from "react";
import { CurrentType } from "@/types/current";
import { FamilyType } from "@/types/family";
import { CountryDataType } from "@/types/countryData";

interface VisibleCurrentsContextType {
  visibleCurrents: CurrentType[] | null;
  setVisibleCurrents: (visibleCurrents: CurrentType[]) => void;
}

// Create context for visible currents
const VisibleCurrentsContext = createContext<
  VisibleCurrentsContextType | undefined
>(undefined);

// Create a hook to use the visible currents context
export const useVisibleCurrentsContext = () => {
  const context = useContext(VisibleCurrentsContext);
  if (!context) {
    throw new Error(
      "useVisibleCurrentsContext must be used within a VisibleCurrentsProvider"
    );
  }
  return context;
};

// Create a provider for the visible currents context
export const VisibleCurrentsProvider = ({
  children,
  countryData
}: {
  children: React.ReactNode;
  countryData: CountryDataType;
}) => {
  const currents = countryData.families.flatMap(
    (family: FamilyType) => family.currents
  );
  const [visibleCurrents, setVisibleCurrents] = useState(currents);

  return (
    <VisibleCurrentsContext.Provider
      value={{ visibleCurrents, setVisibleCurrents }}
    >
      {children}
    </VisibleCurrentsContext.Provider>
  );
};
