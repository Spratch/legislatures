import { CountryType } from "@/types/country";
import { CoalitionsProvider } from "./coalitionsContext";
import { CountryDataProvider } from "./countryContext";
import { VisibleCurrentsProvider } from "./currentsContext";
import { DetailsProvider } from "./detailsContext";
import { DictionaryProvider } from "./dictionaryContext";
import { TransitionsProvider } from "./transitionsContext";
import { Provider as JotaiProvider } from "jotai";

type Props = { children: React.ReactNode; dict: any; countryData: CountryType };

export default function Providers({ children, dict, countryData }: Props) {
  return (
    <DictionaryProvider dictionary={dict}>
      <CountryDataProvider countryData={countryData}>
        <JotaiProvider>
          <VisibleCurrentsProvider countryData={countryData}>
            <DetailsProvider>
              <TransitionsProvider>
                <CoalitionsProvider>{children}</CoalitionsProvider>
              </TransitionsProvider>
            </DetailsProvider>
          </VisibleCurrentsProvider>
        </JotaiProvider>
      </CountryDataProvider>
    </DictionaryProvider>
  );
}
