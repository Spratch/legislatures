"use client";

import { createContext, useContext } from "react";

interface Dictionary {
  [key: string]: { [key: string]: string };
}

const DictionaryContext = createContext<Dictionary | null>(null);

export const DictionaryProvider = ({
  dictionary,
  children
}: {
  dictionary: Dictionary;
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
