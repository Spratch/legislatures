import { CountryDataType } from "@/types/countryData";
import { CoalitionsProvider } from "./coalitionsContext";
import { CountryDataProvider } from "./countryContext";
import { VisibleCurrentsProvider } from "./currentsContext";
import { DetailsProvider } from "./detailsContext";
import { TransitionsProvider } from "./transitionsContext";
import { Provider as JotaiProvider } from "jotai";

type Props = {
  children: React.ReactNode;
  countryData: CountryDataType;
};

export default function Providers({ children, countryData }: Props) {
  return (
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
  );
}
