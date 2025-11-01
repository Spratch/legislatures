import EntityDetails from "./entityDetails";
import Chart from "../chart/chart";
import { CurrentType } from "@/types/current";
import { EventType } from "@/types/event";
import { RegimeType } from "@/types/regime";
import { useDetailsContext } from "@/utils/contexts/detailsContext";
import { useCallback } from "react";

type Props = {
  regimes: RegimeType[];
  currents: CurrentType[];
  events: EventType[];
  eventsVisibility: boolean;
  referenceSize: number;
};

export default function Main({
  regimes,
  currents,
  events,
  eventsVisibility,
  referenceSize
}: Props) {
  const { detailsContent } = useDetailsContext();
  const selectedEntity = detailsContent?.entity;

  // Set the scroll position to the bottom on first render
  const scrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        if (node.scrollHeight > node.clientHeight) {
          node.scrollTop = node.scrollHeight;
        }
      }, 0);
    }
  }, []);

  return (
    <main className="relative mx-auto h-[calc(100dvh-6.5rem)] w-full max-w-screen-3xl">
      <div
        ref={scrollRef}
        className="no-scrollbar h-full w-full overflow-y-scroll overscroll-none"
      >
        {/* Chart */}
        {regimes && currents && events && (
          <Chart
            regimes={regimes}
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
