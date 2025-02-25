import {
  HeightIcon,
  InfoCircledIcon,
  MarginIcon,
  MinusIcon,
  PaddingIcon,
  PinLeftIcon,
  PlusIcon
} from "@radix-ui/react-icons";
import SettingsButton from "./settingsButton";
import { useDictionary } from "../utils/contexts/dictionaryContext";

function HideTransitionsIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.81742 6.36819C7.64168 6.54393 7.35676 6.54393 7.18102 6.36819L4.68102 3.86819C4.50532 3.69245 4.50532 3.40753 4.68102 3.23179C4.85672 3.05606 5.14168 3.05606 5.31742 3.23179L7.04922 4.9636C7.04922 4.9636 7.04922 1.5 7.04922 1C7.04922 0.75 7.25069 0.55 7.49922 0.55C7.74775 0.55 7.94922 0.75 7.94922 1C7.94922 1.28906 7.94922 4.9636 7.94922 4.9636L9.68102 3.23179C9.85676 3.05606 10.1417 3.05606 10.3174 3.23179C10.4932 3.40753 10.4932 3.69246 10.3174 3.8682L7.81742 6.36819Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.18111 8.63181C7.35685 8.45606 7.64177 8.45606 7.81751 8.63181L10.3175 11.1318C10.4932 11.3075 10.4932 11.5925 10.3175 11.7682C10.1418 11.9439 9.85685 11.9439 9.68111 11.7682L7.94931 10.0364C7.94931 10.0364 7.94931 13.5 7.94931 14C7.94931 14.25 7.74785 14.45 7.49931 14.45C7.25078 14.45 7.04931 14.25 7.04931 14C7.04931 13.7109 7.04931 10.0364 7.04931 10.0364L5.31751 11.7682C5.14177 11.9439 4.85685 11.9439 4.68111 11.7682C4.50538 11.5925 4.50538 11.3075 4.68111 11.1318L7.18111 8.63181Z"
        fill="black"
      />
    </svg>
  );
}

type Props = {
  eventVisibility: boolean;
  setEventVisibility: (eventVisibility: boolean) => void;
  referenceSize: number;
  setReferenceSize: (referenceSize: number) => void;
  setInfosVisibility: (infosVisibility: boolean) => void;
  transitionsVisibility: boolean;
  setTransitionsVisibility: (transitionsVisibility: boolean) => void;
  coalitionsVisibility: boolean;
  setCoalitionsVisibility: (coalitionsVisibility: boolean) => void;
};

export default function SettingsLine({
  eventVisibility,
  setEventVisibility,
  referenceSize,
  setReferenceSize,
  setInfosVisibility,
  transitionsVisibility,
  setTransitionsVisibility,
  coalitionsVisibility,
  setCoalitionsVisibility
}: Props) {
  const dict = useDictionary().settingsLine;
  return (
    <section className="w-full p-2 flex items-end max-w-screen-3xl mx-auto">
      <div className="w-full flex justify-between gap-2">
        {/* Left */}
        <div className="flex gap-1 items-center">
          {/* Events button */}
          <SettingsButton
            Icon={PinLeftIcon}
            onClick={() => setEventVisibility(!eventVisibility)}
            label={eventVisibility ? dict.hideEvents : dict.showEvents}
            flipIcon={eventVisibility ? false : true}
            position={{ x: "left", y: "top" }}
            kbd="e"
          />

          {/* Transition polygons button */}
          <SettingsButton
            Icon={transitionsVisibility ? HideTransitionsIcon : HeightIcon}
            onClick={() => setTransitionsVisibility(!transitionsVisibility)}
            label={
              transitionsVisibility
                ? dict.hideTransitions
                : dict.showTransitions
            }
            position={{ x: "left", y: "top" }}
            kbd="t"
          />

          {/* Coalitions button */}
          <SettingsButton
            Icon={coalitionsVisibility ? PaddingIcon : MarginIcon}
            onClick={() => setCoalitionsVisibility(!coalitionsVisibility)}
            label={
              coalitionsVisibility ? dict.hideCoalitions : dict.showCoalitions
            }
            position={{ x: "left", y: "top" }}
            kbd="c"
          />
        </div>

        {/* Right */}
        <div className="flex gap-2 items-center">
          {/* Infos button */}
          <SettingsButton
            Icon={InfoCircledIcon}
            // name={dict.infos}
            onClick={() => setInfosVisibility(true)}
            label={dict.informations}
            position={{ x: "right", y: "top" }}
            kbd="i"
          />

          {/* Reference size buttons */}
          <SettingsButton
            Icon={MinusIcon}
            onClick={() => setReferenceSize(Math.max(4, referenceSize - 12))}
            label={dict.decreaseSize}
            position={{ x: "right", y: "top" }}
            kbd={["-", "_"]}
          />
          <p className="text-sm opacity-75 select-none tabular-nums">
            <span className="sr-only">{dict.graphSize}</span>
            {String(referenceSize).padStart(2, "0")}
          </p>
          <SettingsButton
            Icon={PlusIcon}
            onClick={() => setReferenceSize(Math.min(88, referenceSize + 12))}
            label={dict.increaseSize}
            position={{ x: "right", y: "top" }}
            kbd={["+", "="]}
          />
        </div>
      </div>
    </section>
  );
}
