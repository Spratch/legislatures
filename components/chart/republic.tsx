import { motion } from "framer-motion";
import { CurrentType } from "../../types/current";
import { LegislatureType } from "../../types/legislature";
import { RepublicType } from "../../types/republic";
import { ChartDimensions } from "../utils/hooks/useChartDimensions";
import Legislature from "./legislature";
import getDate from "../utils/getDate";
import getYear from "../utils/getYear";

type RepublicProps = {
  republic: RepublicType;
  index: number;
  axisLeftPosition: number;
  minHeight: number;
  firstLegislature: number;
  dimensions: ChartDimensions;
  currents: CurrentType[];
  nextRepFirstLeg: LegislatureType | null;
};

export default function Republic({
  republic,
  index,
  axisLeftPosition,
  minHeight,
  firstLegislature,
  dimensions,
  currents,
  nextRepFirstLeg
}: RepublicProps) {
  // Add the next rep first legislature to the current republic
  const republicWithNextRepFirstLeg = nextRepFirstLeg
    ? {
        ...republic,
        legislatures: [...republic.legislatures, nextRepFirstLeg]
      }
    : republic;

  // Give an index to each legislature and currents to each party
  const legislaturesWithIndexes = republicWithNextRepFirstLeg.legislatures.map(
    (leg, i) => {
      // In legislature, find the corresponding current for each party
      const partiesWithCurrents = leg.parties
        .map((party) => {
          const current = currents.find((current) =>
            current.parties.find((p) => p.name === party.name)
          );
          const full_name = current?.parties.find(
            (p) => p.name === party.name
          )?.full_name;

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

  const firstLegOfRegime = republic.legislatures[0];
  const regimeY = (getDate(republic.begin) - firstLegislature) * minHeight;
  const regimeWidth = dimensions.boundedWidth - axisLeftPosition;

  const republicDescription = `(de ${getYear(getDate(republic.begin))} à ${
    getYear(getDate(republic.end)) || "aujourd'hui"
  }). ${republic.legislatures.length} législatures.`;

  return (
    <g
      aria-labelledby={`regime-${republic.begin}-label`}
      // aria-describedby={`regime-${republic.begin}-description`}
      aria-details={`regime-${republic.begin}-description`}
      key={republic.name}
      className={`regime-${republic.name}`}
      transform={`translate(${axisLeftPosition}, 0)`}
      role="listitem"
    >
      {/* Legislatures list */}
      <g
        role="list"
        aria-label="Législatures"
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
              dimensions={dimensions}
              axisLeftPosition={axisLeftPosition}
              isNextRep={
                leg.index === legislaturesWithIndexes.length - 1 &&
                leg.legislature !== 2024
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
            id={`regime-${republic.begin}-description`}
            className="sr-only"
          >
            {republicDescription}
          </text>
          <motion.text
            id={`regime-${republic.begin}-label`}
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
            {republic.name}
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
