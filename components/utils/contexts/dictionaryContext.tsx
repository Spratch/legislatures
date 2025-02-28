"use client";

import { createContext, useContext } from "react";

export interface DictionaryType {
  [key: string]: { [key: string]: string };
}

const DictionaryContext = createContext<DictionaryType | null>(null);

export const DictionaryProvider = ({
  dictionary,
  children
}: {
  dictionary: DictionaryType;
  children: React.ReactNode;
}) => (
  <DictionaryContext.Provider value={dictionary}>
    {children}
  </DictionaryContext.Provider>
);

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};
