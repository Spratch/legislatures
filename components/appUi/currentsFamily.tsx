import { useMemo, useState } from "react";
import { FamilyType } from "@/types/family";
import SettingsButton from "./settingsButton";
import EntityButton from "./entityButton";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useDictionary } from "../utils/contexts/dictionaryContext";
import { getLangKey } from "../utils/getLangKey";
import { CurrentType } from "@/types/current";

type Props = {
  family: FamilyType;
  onCurrentClick: (current: any) => void;
};

export default function CurrentsFamily({ family, onCurrentClick }: Props) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.filtersLine;

  const familyName = family[getLangKey("name", lang)];

  // Is currents family button open
  const [isActive, setIsActive] = useState(false);
  // Context for visible currents
  const { visibleCurrents, setVisibleCurrents } = useVisibleCurrentsContext();
  // Is full family visible
  const isFamilyVisible = family.currents.every((familyCurrent) =>
    visibleCurrents.some((current) => current.name === familyCurrent.name)
  );

  // Toggle full family visibility
  function toggleFullFamily() {
    // If the family is totally visible, we hide it, else we show it
    if (isFamilyVisible) {
      setVisibleCurrents(
        visibleCurrents.filter(
          (current) =>
            !family.currents.some(
              (familyCurrent) => familyCurrent.name === current.name
            )
        )
      );
    } else {
      setVisibleCurrents([...visibleCurrents, ...family.currents]);
    }
  }

  // Merge two currents if they have the same name (even with additionnal space), keep the name and color of the first one, and merge the parties
  const mergedCurrents = useMemo<CurrentType[]>(() => {
    let currentMap = {};

    family.currents.forEach((current) => {
      // Erase the spaces at the beginning and end of the name
      const normalizedName = current.name.trim();

      // If the current already exists in the map, we merge the parties
      if (currentMap[normalizedName]) {
        currentMap[normalizedName].parties = [
          ...currentMap[normalizedName].parties,
          ...current.parties
        ];
      } else {
        // Otherwise, we add the current to the map
        currentMap[normalizedName] = { ...current, name: normalizedName };
      }
    });
    return Object.values(currentMap);
  }, [family]);

  const familyNumber = mergedCurrents.filter((current) =>
    visibleCurrents.some(
      (visibleCurrent) => visibleCurrent.name === current.name
    )
  ).length;

  return (
    <>
      <div className="flex last:*:-ml-px">
        <SettingsButton
          number={familyNumber}
          color={family.color}
          name={familyName}
          onClick={() => {
            setIsActive(!isActive);
          }}
          isActive={isActive}
          label={`${isActive ? dict.hide : dict.show} ${
            dict.currentsList + " " + familyName
          }`}
          straightSide="right"
        />
        <SettingsButton
          Icon={isFamilyVisible ? EyeOpenIcon : EyeClosedIcon}
          onClick={() => toggleFullFamily()}
          label={`${isFamilyVisible ? dict.hide : dict.show} ${
            dict.allCurrents + " " + familyName
          }`}
          straightSide="left"
        />
      </div>
      {isActive && (
        <>
          {mergedCurrents.map((current, index) => {
            const isCurrentVisible = visibleCurrents.some(
              (visibleCurrent) => visibleCurrent.name === current.name
            );
            return (
              <EntityButton
                key={index}
                entity={current}
                onClick={() => onCurrentClick(current)}
                isActive={isCurrentVisible}
                label={`${isCurrentVisible ? dict.hide : dict.show} ${
                  dict.theCurrent + " " + current.name
                }`}
              />
            );
          })}
        </>
      )}
    </>
  );
}
