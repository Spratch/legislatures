"use client";

import { useState } from "react";
import FiltersLine from "@/components/appUi/filtersLine";
import Main from "@/components/appUi/main";
import SettingsLine from "@/components/appUi/settingsLine";
import InfosModal from "@/components/appUi/infosModal";
import { useTransitionsContext } from "@/utils/contexts/transitionsContext";
import { useCoalitionsContext } from "@/utils/contexts/coalitionsContext";
import { useCountryDataContext } from "@/utils/contexts/countryContext";
import { usePathname, useRouter } from "next/navigation";
import { LocaleEnum } from "@/types/langsEnum";

export default function HomePage() {
  const [eventVisibility, setEventVisibility] = useState(false);
  const [referenceSize, setReferenceSize] = useState(28);
  const [infosVisibility, setInfosVisibility] = useState(false);
  const { transitionsVisibility, setTransitionsVisibility } =
    useTransitionsContext();
  const { coalitionsVisibility, setCoalitionsVisibility } =
    useCoalitionsContext();
  const {
    countryData: { regimes, families, events }
  } = useCountryDataContext();
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const setLanguage = (lang: keyof typeof LocaleEnum) => {
    const newPath = pathName.replace(/\/[a-z]{2}\//, `/${lang}/`);
    router.replace(newPath, { scroll: false });
  };

  return (
    <>
      <SettingsLine
        eventVisibility={eventVisibility}
        setEventVisibility={(newValue) => setEventVisibility(newValue)}
        referenceSize={referenceSize}
        setReferenceSize={(newSize) => setReferenceSize(newSize)}
        setInfosVisibility={setInfosVisibility}
        transitionsVisibility={transitionsVisibility}
        setTransitionsVisibility={(newValue) =>
          setTransitionsVisibility(newValue)
        }
        coalitionsVisibility={coalitionsVisibility}
        setCoalitionsVisibility={(newValue) =>
          setCoalitionsVisibility(newValue)
        }
        isSelectorOpen={isSelectorOpen}
        setSelectorOpen={(newValue) => setSelectorOpen(newValue)}
        setLanguage={(lang) => setLanguage(lang)}
      />

      <Main
        regimes={regimes}
        currents={families.flatMap((family) => family.currents)}
        events={events}
        eventsVisibility={eventVisibility}
        referenceSize={referenceSize}
      />

      <FiltersLine families={families} />

      {infosVisibility && (
        <InfosModal setInfosVisibility={setInfosVisibility} />
      )}
    </>
  );
}
