import { useMemo } from "react";
import { LegislatureType } from "@/types/legislature";
import { motion } from "framer-motion";
import getDate from "../utils/getDate";
import { scaleLinear } from "d3";

// Inspired by https://2019.wattenberger.com/blog/react-and-d3

interface Props {
  domain?: [number, number];
  range?: [number, number];
  axisLeftPosition?: number;
  legislatures: LegislatureType[];
}

export default function YAxis({
  domain = [1792, 2024],
  range = [0, 300],
  axisLeftPosition = 0,
  legislatures
}: Props) {
  const ticks = useMemo(() => {
    const yScale = scaleLinear().domain(domain).range(range);

    const customTicks = legislatures.map((leg) => getDate(leg.begin));

    return customTicks.map((value) => ({
      value,
      yOffset: yScale(value)
    }));
  }, [domain, legislatures, range]);

  return (
    <g
      aria-hidden
      className="y-axis"
    >
      {/* The axis line */}
      <path
        d={[
          "M",
          axisLeftPosition,
          0, // Start at {axisLeftPosition}% on the x axis and {axisTopPosition}px on the y axis
          "v",
          6, // First tick
          "V",
          ticks[ticks.length - 1].yOffset + 28, // Move to the bottom of the y axis
          "v",
          -6 // Last tick
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />

      {/* Y axis ticks */}
      <g
        className="y-axis-ticks"
        transform={`translate(${axisLeftPosition}, 0)`}
      >
        {ticks.map(({ value, yOffset }) => (
          <motion.g
            key={value}
            animate={{ y: yOffset }}
            transition={{ duration: 0.5 }}
          >
            {/* Tick line */}
            <line
              x1="-6"
              x2="0"
              stroke="currentColor"
            />
            {/* Tick text */}
            <text
              aria-hidden
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: "translate(-20px, 10px)"
              }}
            >
              {value.toString().split(".")[0]}
            </text>
          </motion.g>
        ))}
      </g>
    </g>
  );
}
