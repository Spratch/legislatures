"use client";

import { createContext, useContext, useState } from "react";
import { CurrentType } from "@/types/current";
import { FamilyType } from "@/types/family";
import { RepublicType } from "@/types/republic";
import { EventType } from "@/types/event";

export interface CountryData {
  regimes: RepublicType[];
  currents: { families: FamilyType[] };
  events: EventType[];
}

interface VisibleCurrentsContextType {
  visibleCurrents: CurrentType[] | null;
  setVisibleCurrents: (visibleCurrents: CurrentType[]) => void;
  countryData: CountryData;
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
  countryData: CountryData;
}) => {
  const currents = countryData.currents.families.flatMap(
    (family: FamilyType) => family.currents
  );
  const [visibleCurrents, setVisibleCurrents] = useState(currents);

  return (
    <VisibleCurrentsContext.Provider
      value={{ visibleCurrents, setVisibleCurrents, ...countryData }}
    >
      {children}
    </VisibleCurrentsContext.Provider>
  );
};
