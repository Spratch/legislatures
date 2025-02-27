"use client";

import PartyBar from "./partyBar";
import { LegislatureType } from "@/types/legislature";
import { ChartDimensions } from "@/utils/hooks/useChartDimensions";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import { CurrentType } from "@/types/current";
import { motion } from "framer-motion";
import { useTransitionsContext } from "@/utils/contexts/transitionsContext";
import getDate from "@/utils/getDate";
import { useCoalitionsContext } from "@/utils/contexts/coalitionsContext";
import getYear from "@/utils/getYear";
import { useSetAtom } from "jotai";
import { tooltipContentAtom } from "@/utils/contexts/tooltipContext";
import { useDictionary } from "@/utils/contexts/dictionaryContext";

type LegislatureProps = {
  leg: LegislatureType;
  nextLeg: LegislatureType | null;
  minHeight: number;
  dimensions: ChartDimensions;
  firstLegislature: number;
  axisLeftPosition: number;
  isNextRep: boolean;
};

export default function Legislature({
  leg,
  nextLeg,
  minHeight,
  dimensions,
  firstLegislature,
  axisLeftPosition,
  isNextRep
}: LegislatureProps) {
  const dict = useDictionary().legislature;

  const { coalitionsVisibility } = useCoalitionsContext();

  // Toggle currents transition polygons visibility
  const { transitionsVisibility } = useTransitionsContext();
  const heightShare = transitionsVisibility ? 1.75 : 1;

  // Place the legislature on the y axis
  const y = (getDate(leg.begin) - firstLegislature) * minHeight;

  // Generate the height of the legislature from its duration and the minimum height
  const duration =
    getDate(nextLeg ? nextLeg.begin : leg.end) - getDate(leg.begin);
  const height = (duration * minHeight) / heightShare;

  // Calculate the width of the graph from the bounded width and the axis left position percentage
  let graphWidth = dimensions.boundedWidth - axisLeftPosition;
  graphWidth < 0 ? (graphWidth = 0) : graphWidth;

  // Get the filtered total deputies
  const { visibleCurrents }: { visibleCurrents: CurrentType[] } =
    useVisibleCurrentsContext();
  const filteredTotalDeputies = leg.parties.reduce((accumulator, party) => {
    if (
      visibleCurrents.find((current) =>
        current.parties.find((p) => p.name === party.name)
      )
    ) {
      return accumulator + party.deputes;
    } else {
      return accumulator;
    }
  }, 0);

  // Same for the next legislature
  const filteredNextTotalDeputies = nextLeg
    ? nextLeg.parties.reduce((accumulator, party) => {
        if (
          visibleCurrents.find((current) =>
            current.parties.find((p) => p.name === party.name)
          )
        ) {
          return accumulator + party.deputes;
        } else {
          return accumulator;
        }
      }, 0)
    : null;

  // Set the hovered party
  const setTooltipContent = useSetAtom(tooltipContentAtom);

  // Set the motion transition duration
  const transitionDuration = 0.5;

  // Screen readers
  const mostImportantParty = leg.parties.reduce((a, b) =>
    a.deputes > b.deputes ? a : b
  );
  // Find most important coalition by reducing deputies number of all parties having the same coalition
  const coalitionsParties = leg.parties.filter((p) => p.coalition);
  const coalitionsDeputies = coalitionsParties.reduce(
    (acc, party) => {
      if (party.coalition) {
        if (!acc[party.coalition]) {
          acc[party.coalition] = { name: party.coalition, deputes: 0 };
        }
        acc[party.coalition].deputes += party.deputes;
      }
      return acc;
    },
    {} as { [key: string]: { name: string; deputes: number } }
  );

  // Find the coalition with the most deputies
  const mostImportantCoalition = Object.values(coalitionsDeputies).reduce(
    (a, b) => (a.deputes > b.deputes ? a : b),
    { name: "", deputes: 0 }
  );
  const isPartyMostImportantEntity =
    mostImportantParty.deputes > mostImportantCoalition.deputes;

  const srDescription = isPartyMostImportantEntity
    ? `${dict.majorityCurrent}: ${mostImportantParty.current.name} ${
        dict.with
      }: ${mostImportantParty.full_name}, (${(
        (mostImportantParty.deputes / leg.total_deputes) *
        100
      ).toFixed(0)}%).`
    : `${dict.majorityCoalition}: ${mostImportantCoalition.name}, (${(
        (mostImportantCoalition.deputes / leg.total_deputes) *
        100
      ).toFixed(0)}%)`;

  // Hide the next rep first leg, its only purpose is to calculate the transition polygons
  if (isNextRep) {
    return null;
  }

  return (
    <motion.g
      key={leg.begin}
      aria-label={`${dict.legislature}: ${dict.from} ${getYear(
        getDate(leg.begin)
      )} ${dict.to} ${getYear(getDate(leg.end)) || dict.today}`}
      role="listitem"
      className={`legislature-${leg.legislature}`}
      animate={{ y: y }}
      transition={{ duration: transitionDuration }}
    >
      <text className="sr-only">{srDescription}</text>
      <g
        role="list"
        aria-label="Partis"
      >
        {leg.parties.map((party, i) => {
          // Find if the party is visible
          const isVisible = visibleCurrents.find((current) =>
            current.parties.find((p) => p.name === party.name)
          );
          // Generate the width of the party with a percentage of the graph width
          const partyWidth = isVisible
            ? graphWidth * (party.deputes / filteredTotalDeputies) || 0
            : 0;
          // Generate the x position of the party by summing the width of the previous parties
          const partyX =
            i === 0
              ? 0
              : leg.parties.slice(0, i).reduce((accumulator, iteratedParty) => {
                  const isIteratedPartyVisible = visibleCurrents.find(
                    (current) =>
                      current.parties.find((p) => p.name === iteratedParty.name)
                  );
                  return isIteratedPartyVisible
                    ? accumulator +
                        graphWidth *
                          (iteratedParty.deputes / filteredTotalDeputies) || 0
                    : accumulator;
                }, 0);
          // Check if the party is in a coalition, and if it's the first or last party of the coalition, and what is its most important party color
          const isInCoalition = party.coalition?.length > 1;
          let coalitionDatas = {
            first: false,
            last: false,
            color: "",
            deputies: 0
          };
          if (isInCoalition) {
            // Check if the previous visible party is in the same coalition
            const previousVisibleParty = leg.parties
              .slice(0, i)
              .reverse()
              .find((p) =>
                visibleCurrents.find((current) =>
                  current.parties.find((cp) => cp.name === p.name)
                )
              );
            coalitionDatas.first =
              !previousVisibleParty ||
              previousVisibleParty.coalition !== party.coalition;
            // Check if the next visible party is in the same coalition
            const nextVisibleParty = leg.parties
              .slice(i + 1)
              .find((p) =>
                visibleCurrents.find((current) =>
                  current.parties.find((cp) => cp.name === p.name)
                )
              );
            coalitionDatas.last =
              !nextVisibleParty ||
              nextVisibleParty.coalition !== party.coalition;
            // Find all the parties from the same coalition in the legislature
            const coalitionParties = leg.parties.filter(
              (p) => p.coalition === party.coalition
            );
            // Calculate the total number of deputes in the coalition
            const coalitionTotalDeputies = coalitionParties.reduce(
              (accumulator, party) => accumulator + party.deputes,
              0
            );
            coalitionDatas.deputies = coalitionTotalDeputies;
            // Get the most important party in the coalition
            const coalitionMainParty = coalitionParties.reduce((a, b) =>
              a.deputes > b.deputes ? a : b
            );
            coalitionDatas.color = coalitionMainParty.current.color;
          }
          // Give the party a color based on the coalition visibility
          const partyColor =
            coalitionDatas.color && coalitionsVisibility
              ? party.current.color !== coalitionDatas.color
                ? coalitionDatas.color + "CC" // Add alpha channel (80% opacity)
                : party.current.color
              : party.current.color;
          // Find the corresponding party in the next legislature
          const nextParty = nextLeg
            ? nextLeg.parties?.find(
                (p) => p.current.name === party.current.name
              )
            : null;
          // Find if the next party is visible
          const nextPartyIsVisible = visibleCurrents.find((current) =>
            current.parties.find((p) => p.name === nextParty?.name)
          );
          // Generate the next party width
          const nextPartyWidth = nextLeg
            ? nextPartyIsVisible
              ? graphWidth * (nextParty?.deputes / filteredNextTotalDeputies) ||
                0
              : 0
            : null;
          // Generate the next party x position
          const nextPartyX = nextParty
            ? nextLeg.parties
                .slice(0, nextLeg.parties.indexOf(nextParty))
                .reduce((accumulator, iteratedParty) => {
                  const isIteratedPartyVisible = visibleCurrents.find(
                    (current) =>
                      current.parties.find((p) => p.name === iteratedParty.name)
                  );
                  return isIteratedPartyVisible
                    ? accumulator +
                        graphWidth *
                          (iteratedParty.deputes / filteredNextTotalDeputies) ||
                        0
                    : accumulator;
                }, 0)
            : null;
          // Generate the polygon points
          const polygonPoints = [
            [partyX, height],
            [partyX + partyWidth, height],
            [nextPartyX + nextPartyWidth, height * heightShare],
            [nextPartyX, height * heightShare]
          ]
            .map((point) => point.join(","))
            .join(" ");
          // Create tooltip content
          const tooltipContent = {
            y,
            xStart: partyX,
            xEnd: partyX + partyWidth,
            legislature: leg,
            party,
            coalitionDatas
          };
          return (
            <g
              key={party.name}
              className={`${leg.legislature}-${party.current?.name
                .toLowerCase()
                .replace(/[^a-z]+/g, "")} ${party.deputes} ${partyWidth}`}
              onMouseEnter={() =>
                partyWidth > 0 ? setTooltipContent(tooltipContent) : {}
              }
              onMouseLeave={() => setTooltipContent(null)}
            >
              {/* Parties */}
              <PartyBar
                party={party}
                height={height}
                partyWidth={partyWidth}
                partyX={partyX}
                coalitionDatas={coalitionDatas}
                transitionDuration={transitionDuration}
                barColor={partyColor}
              />
              {/* Transition polygons */}
              {nextParty && polygonPoints && (
                <motion.polygon
                  points={polygonPoints}
                  fill={partyColor}
                  opacity={0.7}
                  shapeRendering="crispEdges"
                  initial={{ points: polygonPoints, fill: partyColor }}
                  animate={{ points: polygonPoints, fill: partyColor }}
                  transition={{ duration: transitionDuration }}
                />
              )}
            </g>
          );
        })}
      </g>
    </motion.g>
  );
}
