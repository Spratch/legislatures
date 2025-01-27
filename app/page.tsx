"use client";

import { useState } from "react";
import FiltersLine from "../components/appUi/filtersLine";
import Main from "../components/appUi/main";
import {
  currents,
  events,
  families,
  republics
} from "../components/utils/contexts/currentsContext";
import SettingsLine from "../components/appUi/settingsLine";
import InfosModal from "../components/appUi/infosModal";
import { useTransitionsContext } from "../components/utils/contexts/transitionsContext";
import { useCoalitionsContext } from "../components/utils/contexts/coalitionsContext";

export default function HomePage() {
  const [eventVisibility, setEventVisibility] = useState(false);
  const [referenceSize, setReferenceSize] = useState(28);
  const [infosVisibility, setInfosVisibility] = useState(false);
  const { transitionsVisibility, setTransitionsVisibility } =
    useTransitionsContext();
  const { coalitionsVisibility, setCoalitionsVisibility } =
    useCoalitionsContext();

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
      />

      <Main
        republics={republics}
        currents={currents}
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
