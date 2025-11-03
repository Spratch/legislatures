import { CurrentType } from "@/types/current";
import { LegislatureType } from "@/types/legislature";
import { RegimeType } from "@/types/regime";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import getDate from "@/utils/getDate";
import getYear from "@/utils/getYear";
import { ChartDimensions } from "@/utils/hooks/useChartDimensions";
import { motion } from "framer-motion";
import { getLangKey } from "../utils/getLangKey";
import Legislature from "./legislature";

type RegimeProps = {
  regime: RegimeType;
  index: number;
  axisLeftPosition: number;
  minHeight: number;
  firstLegislature: number;
  dimensions: ChartDimensions;
  currents: CurrentType[];
  nextRepFirstLeg: LegislatureType | null;
};

export default function Regime({
  regime,
  axisLeftPosition,
  minHeight,
  firstLegislature,
  dimensions,
  currents,
  nextRepFirstLeg
}: RegimeProps) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.regime;

  // Add the next rep first legislature to the current regime
  const regimeWithNextRepFirstLeg = nextRepFirstLeg
    ? {
        ...regime,
        legislatures: [...regime.legislatures, nextRepFirstLeg]
      }
    : regime;

  // Give an index to each legislature and currents to each party
  const legislaturesWithIndexes = regimeWithNextRepFirstLeg.legislatures.map(
    (leg, i) => {
      // In legislature, find the corresponding current for each party
      const partiesWithCurrents = leg.parties
        .map((party) => {
          const current = currents.find((current) =>
            current.parties.find((p) => p.name === party.name)
          );
          const full_name =
            current?.parties.find((p) => p.name === party.name)?.[
              getLangKey("full_name", lang)
            ] || "";

          if (current) {
            return {
              ...party,
              current,
              full_name
            };
          } else {
            return;
          }
        })
        .filter((party) => party);

      return {
        ...leg,
        index: i,
        parties: partiesWithCurrents
      };
    }
  );

  const firstLegOfRegime = regime.legislatures[0];
  const regimeY = (getDate(regime.begin) - firstLegislature) * minHeight;
  const regimeWidth = dimensions.boundedWidth - axisLeftPosition;

  const regimeDescription = `(${dict.from} ${getYear(
    getDate(regime.begin)
  )} ${dict.to} ${getYear(getDate(regime.end)) || dict.today}). ${
    regime.legislatures.length
  } ${dict.legislatures}.`;

  // Calculate the width of the graph from the bounded width and the axis left position percentage
  let graphWidth = dimensions.boundedWidth - axisLeftPosition;
  graphWidth < 0 ? (graphWidth = 0) : graphWidth;

  return (
    <g
      aria-labelledby={`regime-${regime.begin}-label`}
      // aria-describedby={`regime-${regime.begin}-description`}
      aria-details={`regime-${regime.begin}-description`}
      key={regime.name}
      className={`regime-${regime.name}`}
      transform={`translate(${axisLeftPosition}, 0)`}
      role="listitem"
    >
      {/* Legislatures list */}
      <g
        role="list"
        aria-label={dict.legislaturesList}
      >
        {legislaturesWithIndexes.map((leg) => {
          // Find the next legislature and add the currents to the parties
          const nextLeg = legislaturesWithIndexes.find(
            (l) => l.index === leg.index + 1
          );
          const nextPartiesWithCurrents = nextLeg
            ? nextLeg.parties
                .map((party) => {
                  const current = currents.find((current) =>
                    current.parties.find((p) => p.name === party.name)
                  );
                  if (current) {
                    return {
                      ...party,
                      current
                    };
                  } else {
                    return;
                  }
                })
                .filter((party) => party)
            : null;
          const nextLegislatureWithCurrents = nextLeg
            ? {
                ...nextLeg,
                parties: nextPartiesWithCurrents
              }
            : null;
          return (
            <Legislature
              key={leg.begin}
              leg={leg}
              nextLeg={nextLegislatureWithCurrents}
              firstLegislature={firstLegislature}
              minHeight={minHeight}
              graphWidth={graphWidth}
              isNextRep={
                leg.index === legislaturesWithIndexes.length - 1 &&
                leg.end !== "now"
              }
            />
          );
        })}
      </g>

      {/* Regime name */}
      {minHeight > 8 && (
        <g className="pointer-events-none">
          <text
            aria-hidden
            id={`regime-${regime.begin}-description`}
            className="sr-only"
          >
            {regimeDescription}
          </text>
          <motion.text
            id={`regime-${regime.begin}-label`}
            dy={-4}
            fontSize={12}
            textAnchor="middle"
            initial={{
              x: regimeWidth / 2,
              y: regimeY
            }}
            animate={{
              x: regimeWidth / 2,
              y: regimeY
            }}
            transition={{ duration: 0.5 }}
          >
            {regime[getLangKey("name", lang)]}
          </motion.text>
          <motion.line
            x1={0}
            stroke="black"
            strokeWidth={1}
            strokeDasharray={"2 2"}
            initial={{
              x2: regimeWidth,
              y1: regimeY - 0.5,
              y2: regimeY - 0.5
            }}
            animate={{
              x2: regimeWidth,
              y1: regimeY - 0.5,
              y2: regimeY - 0.5
            }}
            transition={{ duration: 0.5 }}
          />
        </g>
      )}
    </g>
  );
}
