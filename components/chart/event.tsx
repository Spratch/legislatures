import { motion } from "framer-motion";
import { EventType } from "@/types/event";
import getDate from "@/utils/getDate";
import getYear from "@/utils/getYear";
import { useDictionary } from "@/utils/contexts/dictionaryContext";

type Props = {
  event: EventType;
  axisLeftPosition: number;
  minHeight: number;
  firstLegislature: number;
  onClick: () => void;
  eventsVisibility: boolean;
};

export default function Event({
  event,
  axisLeftPosition,
  minHeight,
  firstLegislature,
  onClick,
  eventsVisibility
}: Props) {
  const dictionary = useDictionary();
  const lang = dictionary.locale.lang;
  const dict = dictionary.event;

  const eventTitle = event[`title${lang === "fr" ? "" : "_" + lang}`];

  const beginDate = getDate(event.begin);
  const endDate = getDate(event.end);

  const formatDates = (label: boolean = false) => {
    return (
      (getYear(endDate) !== getYear(beginDate)
        ? `${getYear(beginDate)} ${label ? "à" : "→"} ${getYear(endDate)}`
        : getYear(beginDate)) + (label ? ", " + eventTitle : "")
    );
  };

  const y = (beginDate - firstLegislature) * minHeight;
  const height = Math.max((endDate - beginDate) * minHeight, minHeight);

  const fontSize = 11;
  const textX = 8;
  const textY = fontSize;

  // Check if the event is tall enough to display the title
  const isTall = height < fontSize * 2.5 ? false : true;

  const transitionDuration = 0.5;

  // Event type color
  const eventColor =
    {
      Cohabitation: "#FFC107",
      Référendum: "#4CAF50",
      Lutte: "#673AB7",
      Guerre: "#D32F2F",
      Loi: "#2196F3"
    }[event.type] || "black";

  return (
    <motion.g
      key={eventTitle}
      clipPath={`url(#clip-${event.begin})`}
      initial={{ y: y }}
      animate={{ y: y }}
      transition={{ duration: transitionDuration }}
      onClick={onClick}
      className="cursor-pointer group/event group-has-[g:hover]/eventslist:[&:not(:hover)]:opacity-25 transition-opacity duration-500"
      role="listitem"
      aria-label={formatDates(true)}
    >
      {/* Clip */}
      <defs>
        <clipPath id={`clip-${event.begin}`}>
          <motion.rect
            x="0"
            y="-2"
            width={axisLeftPosition}
            initial={{ height: height * 1.5 }}
            animate={{ height: height * 1.5 }}
            transition={{ duration: transitionDuration }}
          />
        </clipPath>
      </defs>

      {/* Top line */}
      <line
        x1={0}
        x2={axisLeftPosition}
        y1={-1}
        y2={-1}
        stroke={eventColor}
        // strokeDasharray={"4"}
        strokeWidth={0.1}
        strokeOpacity={1}
      />

      {/* Event rectangle */}
      <motion.rect
        x={0}
        y={-1}
        width={axisLeftPosition}
        initial={{ height: height }}
        animate={{ height: height }}
        transition={{ duration: transitionDuration }}
        fill={eventColor}
        className="opacity-5 group-hover/event:opacity-15 transition-opacity"
        aria-label={dict.openDetails}
        role="button"
        onClick={onClick}
        tabIndex={eventsVisibility ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
      />

      {/* Event text */}
      <g
        aria-hidden
        className="translate-x-0 sm:translate-x-5"
      >
        {/* Event date */}
        <text
          x={textX}
          y={textY}
          textAnchor="left"
          fill={eventColor}
          className="opacity-50 group-hover/event:opacity-85 transition-opacity"
          fontSize={fontSize}
        >
          <tspan>{formatDates()}</tspan>
        </text>

        {/* Event title */}
        <motion.text
          initial={{
            x: isTall
              ? textX
              : getYear(endDate) !== getYear(beginDate)
                ? textX + fontSize * 6.5
                : textX + fontSize * 2.75,
            y: isTall ? textY + fontSize + 1 : textY
          }}
          animate={{
            x: isTall
              ? textX
              : getYear(endDate) !== getYear(beginDate)
                ? textX + fontSize * 6.5
                : textX + fontSize * 2.75,
            y: isTall ? textY + fontSize + 1 : textY
          }}
          transition={{ duration: transitionDuration }}
          textAnchor="left"
          fill={eventColor}
          fontSize={fontSize}
        >
          {eventTitle}
        </motion.text>
      </g>
    </motion.g>
  );
}
