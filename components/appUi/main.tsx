"use client";

import EntityDetails from "./entityDetails";

import Chart from "../chart/chart";
import { CurrentType } from "../../types/current";
import { EventType } from "../../types/event";
import { RepublicType } from "../../types/republic";
import { useDetailsContext } from "../utils/contexts/detailsContext";
import { useEffect, useRef, useState } from "react";

type Props = {
  republics: RepublicType[];
  currents: CurrentType[];
  events: EventType[];
  eventsVisibility: boolean;
  referenceSize: number;
};

export default function Main({
  republics,
  currents,
  events,
  eventsVisibility,
  referenceSize
}: Props) {
  const { detailsContent } = useDetailsContext();
  const selectedEntity = detailsContent?.entity;

  // Set the scroll position to the bottom on first render
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!hasScrolled && scrollRef.current) {
      if (scrollRef.current.scrollHeight > scrollRef.current.clientHeight) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setHasScrolled(true);
      }
    }
  }, [hasScrolled, scrollRef, republics]);

  return (
    <main className="relative w-full max-w-screen-3xl mx-auto h-[calc(100dvh-6.5rem)]">
      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-scroll no-scrollbar overscroll-none"
      >
        {/* Chart */}
        {republics && currents && events && (
          <Chart
            republics={republics}
            currents={currents}
            events={events}
            eventsVisibility={eventsVisibility}
            referenceSize={referenceSize}
          />
        )}

        {selectedEntity && <EntityDetails />}
      </div>
    </main>
  );
}
