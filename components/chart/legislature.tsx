import { LegislatureType } from "@/types/legislature";
import { PartyType } from "@/types/party";
import {
  coalitionsVisibilityAtom,
  tooltipContentAtom,
  transitionsVisibilityAtom
} from "@/utils/contexts/atoms";
import { useVisibleCurrentsContext } from "@/utils/contexts/currentsContext";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import getDate from "@/utils/getDate";
import getYear from "@/utils/getYear";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import {
  getFilteredTotal,
  getPartyWidth,
  isPartyVisible
} from "../utils/legislature";
import slugify from "../utils/slugify";
import PartyBar from "./partyBar";

type LegislatureProps = {
  leg: LegislatureType;
  nextLeg: LegislatureType | null;
  minHeight: number;
  graphWidth: number;
  firstLegislature: number;
  isNextRep: boolean;
};

export default function Legislature({
  leg,
  nextLeg,
  minHeight,
  graphWidth,
  firstLegislature,
  isNextRep
}: LegislatureProps) {
  const dict = useDictionary().legislature;
  const { visibleCurrents } = useVisibleCurrentsContext();
  const coalitionsVisibility = useAtomValue(coalitionsVisibilityAtom);
  const transitionsVisibility = useAtomValue(transitionsVisibilityAtom);

  // Place the legislature on the y axis
  const y = (getDate(leg.begin) - firstLegislature) * minHeight;

  // Toggle currents transition polygons visibility
  const heightShare = transitionsVisibility ? 1.75 : 1;

  // Generate the height of the legislature from its duration and the minimum height
  const duration =
    getDate(nextLeg ? nextLeg.begin : leg.end) - getDate(leg.begin);
  const height = (duration * minHeight) / heightShare;

  // Get the filtered total deputies
  const filteredTotalDeputies = getFilteredTotal(leg.parties, visibleCurrents);
  const nextLegFilteredTotalDeputies = nextLeg
    ? getFilteredTotal(nextLeg.parties, visibleCurrents)
    : null;

  // Legislature balance of power
  const mostImportantParty = leg.parties.reduce((a, b) =>
    a.deputies > b.deputies ? a : b
  );

  // Calculate coalition totals and find most important
  const mostImportantCoalition = leg.parties.reduce(
    (acc, party) => {
      if (party.coalition) {
        if (!acc.totals[party.coalition]) {
          acc.totals[party.coalition] = { name: party.coalition, deputies: 0 };
        }
        acc.totals[party.coalition].deputies += party.deputies;

        if (acc.totals[party.coalition].deputies > acc.most.deputies) {
          acc.most = acc.totals[party.coalition];
        }
      }
      return acc;
    },
    {
      totals: {} as { [key: string]: { name: string; deputies: number } },
      most: { name: "", deputies: 0 }
    }
  ).most;
  const isPartyMostImportantEntity =
    mostImportantParty.deputies > mostImportantCoalition.deputies;

  // Screen readers
  const srDescription = isPartyMostImportantEntity
    ? `${dict.majorityCurrent}: ${mostImportantParty.current.name} ${
        dict.with
      }: ${mostImportantParty.full_name}, ${(
        (mostImportantParty.deputies / leg.total_deputies) *
        100
      ).toFixed(0)}%.`
    : `${dict.majorityCoalition}: ${mostImportantCoalition.name}, ${(
        (mostImportantCoalition.deputies / leg.total_deputies) *
        100
      ).toFixed(0)}%.`;

  // Set the hovered party
  const setTooltipContent = useSetAtom(tooltipContentAtom);

  // Set the motion transition duration
  const transitionDuration = 0.5;

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
      animate={{ y }}
      transition={{ duration: transitionDuration }}
    >
      <text className="sr-only">{srDescription}</text>
      <g
        role="list"
        aria-label="Partis"
      >
        {leg.parties.map((party, i) => {
          const isVisible = isPartyVisible(party.name, visibleCurrents);
          const partyWidth = isVisible
            ? getPartyWidth(graphWidth, party.deputies, filteredTotalDeputies)
            : 0;

          const getPartyX = (
            parties: PartyType[],
            partyIndex: number,
            totalDeputies: number
          ) =>
            parties
              .slice(0, partyIndex)
              .filter((p) => isPartyVisible(p.name, visibleCurrents))
              .reduce(
                (acc, p) =>
                  acc + getPartyWidth(graphWidth, p.deputies, totalDeputies),
                0
              );
          const partyX = getPartyX(leg.parties, i, filteredTotalDeputies);

          const coalitionData = {
            first: false,
            last: false,
            color: "",
            deputies: 0
          };

          if (party.coalition) {
            const visibleParties = leg.parties.filter((p) =>
              isPartyVisible(p.name, visibleCurrents)
            );
            const partyIndex = visibleParties.findIndex(
              (p) => p.name === party.name
            );

            coalitionData.first =
              partyIndex === -1 ||
              visibleParties[partyIndex - 1]?.coalition !== party.coalition;

            coalitionData.last =
              partyIndex === -1 ||
              visibleParties[partyIndex + 1]?.coalition !== party.coalition;

            const coalitionParties = leg.parties.filter(
              (p) => p.coalition === party.coalition
            );

            coalitionData.deputies = coalitionParties.reduce(
              (sum, p) => sum + p.deputies,
              0
            );

            coalitionData.color = coalitionParties.reduce((prev, curr) =>
              prev.deputies > curr.deputies ? prev : curr
            ).current.color;
          }

          // Give the party a color based on the coalition visibility
          const partyColor =
            coalitionData.color && coalitionsVisibility
              ? party.current.color !== coalitionData.color
                ? coalitionData.color + "CC" // Add alpha channel (80% opacity)
                : party.current.color
              : party.current.color;

          // Find the corresponding party in the next legislature
          const nextLegParty = nextLeg
            ? nextLeg.parties?.find(
                (p) => p.current.name === party.current.name
              )
            : null;

          const nextLegPartyWidth = nextLeg
            ? isPartyVisible(nextLegParty?.name, visibleCurrents)
              ? getPartyWidth(
                  graphWidth,
                  nextLegParty.deputies,
                  nextLegFilteredTotalDeputies
                )
              : 0
            : null;

          // Generate the next party x position
          const nextLegPartyX = nextLegParty
            ? getPartyX(
                nextLeg.parties,
                nextLeg.parties.indexOf(nextLegParty),
                nextLegFilteredTotalDeputies
              )
            : null;

          // Generate the polygon points ⌜ ⌝ ⌟ ⌞
          const polygonPoints = [
            [partyX, height],
            [partyX + partyWidth, height],
            [nextLegPartyX + nextLegPartyWidth, height * heightShare],
            [nextLegPartyX, height * heightShare]
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
            coalitionData
          };

          return (
            <g
              key={party.name}
              className={`${leg.legislature}-${slugify(party.current?.name)} ${party.deputies} ${partyWidth}`}
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
                coalitionData={coalitionData}
                transitionDuration={transitionDuration}
                barColor={partyColor}
              />
              {/* Transition polygons */}
              {nextLegParty && polygonPoints && (
                <motion.polygon
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
