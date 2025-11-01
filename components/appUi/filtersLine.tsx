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
    <section className="relative z-20 mx-auto flex w-full max-w-screen-3xl items-end p-2">
      <div className="flex h-9 w-full items-end">
        {/* List controls */}
        <div className="flex flex-col items-center gap-1">
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
        <div className="relative w-full overflow-x-hidden overflow-y-visible">
          <div className="pointer-events-none absolute left-0 top-0 z-30 h-full w-4 -translate-x-1.5 bg-gradient-to-r from-white via-white"></div>
          <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-4 translate-x-1.5 bg-gradient-to-l from-white via-white"></div>
          <div
            className="no-scrollbar flex h-9 gap-1 overflow-y-visible overflow-x-scroll px-2"
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
