"use client";

import { ReloadIcon, ShuffleIcon, SymbolIcon } from "@radix-ui/react-icons";
import EntityButton from "./entityButton";
import { CurrentType } from "@/types/current";
import { FamilyType } from "@/types/family";
import CurrentsFamily from "./currentsFamily";
import SettingsButton from "./settingsButton";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import { useHorizontalScroll } from "@/utils/hooks/useHorizontalScroll";
import { useDictionary } from "@/utils/contexts/dictionaryContext";

export default function FiltersLine({ families }: { families: FamilyType[] }) {
  const dict = useDictionary().filtersLine;

  const scrollRef = useHorizontalScroll<HTMLDivElement>(); // Convert vertical scroll to horizontal scroll
  const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
  const currents = families?.flatMap((family) => family.currents);

  // On current click, add or remove it from visible currents
  const handleFilterChange = (current: CurrentType) => {
    if (visibleCurrents.some((c) => c.name === current.name)) {
      setVisibleCurrents(
        visibleCurrents.filter((c) => c.name !== current.name)
      );
    } else {
      setVisibleCurrents([...visibleCurrents, current]);
    }
  };

  // Use Fisher-Yates algorithm to shuffle an array
  const shuffleArray = (array: CurrentType[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle currents and show a random number of them
  const handleShuffle = () => {
    const shuffledCurrents = shuffleArray(currents);
    const randomCurrents = shuffledCurrents.slice(
      0,
      Math.floor(Math.random() * currents.length) + 1
    );
    setVisibleCurrents(randomCurrents);
  };

  return (
    <section className="w-full p-2 flex items-end max-w-screen-3xl mx-auto relative z-20">
      <div className="w-full flex items-end h-9">
        {/* List controls */}
        <div className="flex flex-col gap-1 items-center">
          {/* Show reset button when currents are filtered */}
          <SettingsButton
            Icon={ReloadIcon}
            flipIcon={true}
            onClick={() => setVisibleCurrents(currents)}
            label={dict.resetCurrentsFilters}
            isVisible={visibleCurrents?.length !== currents?.length}
            position={{ x: "left", y: "bottom" }}
            kbd="r"
          />

          {/* Shuffle button */}
          <SettingsButton
            Icon={ShuffleIcon}
            onClick={handleShuffle}
            label={dict.shuffleCurrentsFilters}
            position={{ x: "left", y: "bottom" }}
            kbd="s"
          />
        </div>

        {/* Currents list */}
        <div className="relative overflow-x-hidden overflow-y-visible w-full">
          <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-white via-white z-30 pointer-events-none -translate-x-1.5"></div>
          <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-white via-white z-30 pointer-events-none translate-x-1.5"></div>
          <div
            className="overflow-x-scroll overflow-y-visible h-9 flex gap-1 no-scrollbar px-2"
            ref={scrollRef}
          >
            {families ? (
              families.map((family, index) => (
                <CurrentsFamily
                  key={index}
                  family={family}
                  onCurrentClick={handleFilterChange}
                />
              ))
            ) : (
              <span className="pointer-events-none">
                <EntityButton
                  entity={{
                    name: <SymbolIcon className="size-4 animate-spin" />
                  }}
                  onClick={() => {}}
                  isActive={true}
                  label={dict.loading}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
