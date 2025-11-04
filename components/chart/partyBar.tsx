import { PartyType } from "@/types/party";
import { TooltipContentType } from "@/types/tooltipContent";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { motion } from "framer-motion";
import slugify from "../utils/slugify";

type PartyBarProps = {
  party: PartyType;
  height: number;
  partyWidth: number;
  partyX: number;
  coalitionData: TooltipContentType["coalitionData"];
  transitionDuration: number;
  barColor: string;
};

export default function PartyBar({
  party,
  height,
  partyWidth,
  partyX,
  coalitionData,
  transitionDuration,
  barColor
}: PartyBarProps) {
  const dict = useDictionary().party;

  // Display text if the party is wide enough
  const displayText = partyWidth > 30 && height > 13;

  // Display deputies if the party is tall enough
  const displayDeputies = height > 28;

  const coalitionStrokeWidth = 0.75;
  const strokeOffset = coalitionStrokeWidth / 2;

  const srDescription = `${party.deputies} ${dict.seats}. ${dict.current}: ${
    party.current.name
  }. ${party.coalition ? dict.coalition + party.coalition : ""}`;

  return (
    <motion.g
      key={party.name}
      className={`party-bar party-${slugify(party.name)} current-${slugify(party.current?.name)}`}
      x={partyX}
      y={0}
      animate={{ x: partyX }}
      transition={{ duration: transitionDuration }}
      aria-label={party.full_name}
      aria-hidden={party.deputies === 0}
      role="listitem"
    >
      <text className="sr-only">{srDescription}</text>
      {/* Current rectangle with its current color */}
      <motion.rect
        x={0}
        y={0}
        width={partyWidth}
        height={height}
        fill={barColor}
        shapeRendering="crispEdges" // true: horizontal white lines, false: vertical white lines… :/
        initial={{ width: partyWidth, height: height, fill: barColor }}
        animate={{ width: partyWidth, height: height, fill: barColor }}
        transition={{ duration: transitionDuration }}
      />

      {/* Text, if party is wide enough */}
      {displayText && (
        <>
          {/* Party name */}
          <text
            x={4}
            y={10.5}
            textAnchor="left"
            fill="currentColor"
            fontSize={10}
            aria-hidden
          >
            {party.name}
          </text>

          {/* Deputies number, if legislature is long enough */}
          {displayDeputies && (
            <text
              x={4}
              y={20.5}
              textAnchor="left"
              fill="currentColor"
              opacity={0.5}
              fontSize={10}
              aria-hidden
            >
              {party.deputies}
            </text>
          )}
        </>
      )}

      {/* Coalition borders, if the party is in a coalition */}
      {party.coalition && (
        <>
          {/* Top border */}
          <motion.line
            x1={-coalitionStrokeWidth}
            y1={-strokeOffset}
            y2={-strokeOffset}
            stroke="currentColor"
            strokeWidth={coalitionStrokeWidth}
            initial={{
              x2: partyWidth
            }}
            animate={{
              x2: partyWidth
            }}
            transition={{ duration: transitionDuration }}
          />
          {/* Bottom border */}
          <motion.line
            x1={-coalitionStrokeWidth}
            stroke="currentColor"
            strokeWidth={coalitionStrokeWidth}
            initial={{
              y1: height - strokeOffset,
              x2: partyWidth,
              y2: height - strokeOffset
            }}
            animate={{
              y1: height - strokeOffset,
              x2: partyWidth,
              y2: height - strokeOffset
            }}
            transition={{ duration: transitionDuration }}
          />
          {/* Left border, if first of coalition */}
          {coalitionData.first && (
            <motion.line
              x1={-strokeOffset}
              y1={-strokeOffset}
              x2={-strokeOffset}
              stroke="currentColor"
              strokeWidth={coalitionStrokeWidth}
              initial={{
                y2: height - strokeOffset
              }}
              animate={{
                y2: height - strokeOffset
              }}
              transition={{ duration: transitionDuration }}
            />
          )}

          {/* Right border, if last of coalition */}
          {coalitionData.last && (
            <motion.line
              y1={-strokeOffset}
              stroke="currentColor"
              strokeWidth={coalitionStrokeWidth}
              initial={{
                x1: partyWidth - strokeOffset,
                x2: partyWidth - strokeOffset,
                y2: height - strokeOffset
              }}
              animate={{
                x1: partyWidth - strokeOffset,
                x2: partyWidth - strokeOffset,
                y2: height - strokeOffset
              }}
              transition={{ duration: transitionDuration }}
            />
          )}
        </>
      )}
    </motion.g>
  );
}
