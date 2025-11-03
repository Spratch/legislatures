import { CurrentType } from "@/types/current";
import { EventType } from "@/types/event";
import { RegimeType } from "@/types/regime";
import {
  detailsContentAtom,
  tooltipContentAtom,
  transitionsVisibilityAtom
} from "@/utils/contexts/atoms";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import getDate from "@/utils/getDate";
import useChartDimensions from "@/utils/hooks/useChartDimensions";
import { useAtomValue, useSetAtom } from "jotai";
import Tooltip from "../appUi/tooltip";
import Event from "./event";
import Regime from "./regime";
import XAxis from "./xAxis";
import YAxis from "./yAxis";

type Props = {
  regimes: RegimeType[];
  currents: CurrentType[];
  events: EventType[];
  eventsVisibility: boolean;
  referenceSize: number;
};

export default function Chart({
  regimes,
  currents,
  events,
  eventsVisibility,
  referenceSize
}: Props) {
  const dict = useDictionary().chart;

  // Set the dimensions of the chart by giving the margins
  const [ref, dimensions] = useChartDimensions({
    marginTop: 0,
    marginLeft: 0,
    marginRight: 8,
    marginBottom: 0
  });

  // Find the first and last legislature to calculate the total duration
  const firstLegislature = getDate(regimes[0].legislatures[0].begin);
  const lastLegislature = getDate(
    regimes[regimes.length - 1].legislatures[
      regimes[regimes.length - 1].legislatures.length - 1
    ].begin
  );
  const totalDuration = lastLegislature - firstLegislature;

  // Set the Xaxis height
  const xAxisHeight = 28;

  // Set the minimal height for a legislature (one year, in px)
  const transitionsVisibility = useAtomValue(transitionsVisibilityAtom);
  const minHeight = transitionsVisibility ? referenceSize : referenceSize / 2;

  // Calculate the height of the svg
  const svgHeight =
    minHeight * totalDuration + referenceSize + dimensions.marginBottom;

  // Set the position of the left axis in px
  const eventsPresence = events && events.length > 0;
  const axisLeftPosition = !dimensions.boundedWidth
    ? 0
    : !eventsVisibility
      ? dimensions.boundedWidth < 640 || !eventsPresence
        ? 40
        : 100
      : dimensions.boundedWidth < 640
        ? 200
        : 400;

  // Get the tooltip party
  const setTooltipContent = useSetAtom(tooltipContentAtom);

  // Set the details content for events
  const setDetailsContent = useSetAtom(detailsContentAtom);

  // Get the value of the stops positions for the events gradient
  // Using math.max to avoid negative values, and toFixed to avoid unwanted decimals
  // The formula use a cross-multiplication to get the percentage of start and end of the gradient
  // The gradient start at (100 % - (axisSpace * 3)) and end at (100 % - axisSpace) to be sure axis has always a white background
  const axisSpace = 44; // Width of the Y axis + padding
  const gradientStart = Math.max(
    ((axisLeftPosition - axisSpace * 3) * 100) / axisLeftPosition,
    0
  ).toFixed(2);
  const gradientEnd = Math.max(
    ((axisLeftPosition - axisSpace) * 100) / axisLeftPosition,
    0
  ).toFixed(2);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-visible"
      style={{ height: svgHeight + minHeight }}
    >
      {/* X Axis and top margin */}
      <div
        aria-hidden
        className="sticky top-0 z-10 bg-opacity-45 bg-gradient-to-b from-white via-white/50 to-transparent backdrop-blur"
      >
        <svg
          width={dimensions.width}
          height={xAxisHeight}
        >
          <XAxis
            domain={[0, 100]}
            range={[0, dimensions.boundedWidth]}
            axisLeftPosition={axisLeftPosition}
            axisHeight={xAxisHeight}
          />
        </svg>
      </div>

      {/* Chart */}
      <svg
        id="chart"
        width={dimensions.boundedWidth}
        height={svgHeight - 1} // -1 to avoid bottom coalition border on last legislature
        onMouseLeave={() => setTooltipContent(null)}
        className="select-none"
        role="group"
        aria-label={dict.chart}
      >
        {/* Events */}
        {eventsPresence && (
          <g
            className={`events ${
              eventsVisibility ? "" : "pointer-events-none"
            } group/eventslist`}
            role="list"
            aria-hidden={!eventsVisibility}
            aria-label={eventsVisibility ? dict.eventsList : ""}
          >
            {events.map((event, index) => {
              return (
                <Event
                  key={index}
                  event={event}
                  axisLeftPosition={axisLeftPosition}
                  minHeight={minHeight}
                  firstLegislature={firstLegislature}
                  onClick={() =>
                    eventsVisibility ? setDetailsContent({ entity: event }) : {}
                  }
                  eventsVisibility={eventsVisibility}
                />
              );
            })}
          </g>
        )}

        {/* Gradient over events */}
        {eventsPresence && (
          <>
            <rect
              x={0}
              y={0}
              width={axisLeftPosition}
              height={svgHeight}
              fill="url(#events-gradient)"
              className="pointer-events-none"
            />
            <defs>
              <linearGradient id="events-gradient">
                <stop
                  offset={`${gradientStart}%`}
                  stopColor="white"
                  stopOpacity={0}
                />
                <stop
                  offset={`${gradientEnd}%`}
                  stopColor="white"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
          </>
        )}

        {/* Legislatures */}
        <g
          role="list"
          aria-label={dict.regimesList}
        >
          {regimes.map((regime, index) => (
            <Regime
              key={regime.name}
              regime={regime}
              index={index + 1}
              axisLeftPosition={axisLeftPosition}
              minHeight={minHeight}
              firstLegislature={firstLegislature}
              dimensions={dimensions}
              currents={currents}
              nextRepFirstLeg={
                regimes[regimes.indexOf(regime) + 1]?.legislatures[0]
              }
            />
          ))}
        </g>

        <YAxis
          domain={[firstLegislature, lastLegislature]}
          range={[0, totalDuration * minHeight]}
          legislatures={regimes.map((regime) => regime.legislatures).flat()}
          axisLeftPosition={axisLeftPosition}
        />
      </svg>

      {/* Bottom margin */}
      <div
        aria-hidden
        className="sticky bottom-0 z-10 bg-opacity-45 bg-gradient-to-t from-white via-white/50 to-transparent backdrop-blur"
      >
        <svg
          width={dimensions.width}
          height={xAxisHeight}
        >
          <XAxis
            domain={[0, 100]}
            range={[0, dimensions.boundedWidth]}
            axisLeftPosition={axisLeftPosition}
            axisHeight={xAxisHeight}
            axisRevert={true}
          />
        </svg>
      </div>

      {/* Tooltip */}
      <Tooltip
        chartWidth={dimensions.width}
        axisLeftPosition={axisLeftPosition}
      />
    </div>
  );
}
