"use client";

import { createContext, useContext, useState } from "react";
import { CurrentType } from "../../../types/current";
import republicsData from "../../../public/data/republics.json";
import familiesData from "../../../public/data/currents.json";
import eventsData from "../../../public/data/events.json";
import { FamilyType } from "../../../types/family";

export const republics = republicsData.republics;
export const currents = familiesData.families.flatMap(
  (family: FamilyType) => family.currents
);
export const families = familiesData.families;
export const events = eventsData.events;
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
  children
}: {
  children: React.ReactNode;
}) => {
  const [visibleCurrents, setVisibleCurrents] = useState(currents);

  return (
    <VisibleCurrentsContext.Provider
      value={{ visibleCurrents, setVisibleCurrents }}
    >
      {children}
    </VisibleCurrentsContext.Provider>
  );
};
