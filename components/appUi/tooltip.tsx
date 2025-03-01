"use client";

import { useEffect, useRef, useState } from "react";
import { TooltipContentType } from "@/types/tooltipContent";
import { tooltipContentAtom } from "@/utils/contexts/tooltipContext";
import EntityButton from "./entityButton";
import Badge from "./badge";
import PercentageButton from "./percentageButton";
import { useDetailsContext } from "@/utils/contexts/detailsContext";
import { useAtomValue, useSetAtom } from "jotai";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { getLangKey } from "../utils/getLangKey";

type Props = {
  chartWidth: number;
  axisLeftPosition: number;
  tooltipContent: TooltipContentType;
};

export default function Tooltip(props: Omit<Props, "tooltipContent">) {
  const tooltipContent = useAtomValue(tooltipContentAtom);
  if (!tooltipContent) return null;

  return (
    <TooltipContent
      {...props}
      tooltipContent={tooltipContent}
    />
  );
}

export function TooltipContent({
  chartWidth,
  axisLeftPosition,
  tooltipContent
}: Props) {
  const setTooltipContent = useSetAtom(tooltipContentAtom);
  const { setDetailsContent } = useDetailsContext();
  const { y, xStart, xEnd, legislature, party, coalitionDatas } =
    tooltipContent;

  const lang = useDictionary().locale.lang;

  const currentName = party.current[getLangKey("name", lang)];
  const coalitionName = party.coalition
    ? party[getLangKey("coalition", lang)]
    : "";

  // Get tooltip dimensions
  const tooltipRef = useRef(null);

  // Calculate the position of the tooltip
  const tooltipLeft = xStart + axisLeftPosition;

  useEffect(() => {
    if (tooltipRef.current) {
      // Calculate the minimum width of the tooltip from the size of the party
      const partyWidth = xEnd - xStart;
      tooltipRef.current.style.minWidth = `${partyWidth}px`;

      // Top position
      const tooltipHeight = tooltipRef.current.clientHeight;
      // tooltipRef.current.style.top = `${(y - tooltipHeight) + 28}px`;
      if (y - tooltipHeight < 0) {
        tooltipRef.current.style.top = `${0}px`;
      } else {
        tooltipRef.current.style.top = `${y - tooltipHeight + 28}px`;
      }

      // Left position
      const tooltipWidth = tooltipRef.current.clientWidth;
      if (tooltipLeft + tooltipWidth > chartWidth) {
        tooltipRef.current.style.right = "1px";
        tooltipRef.current.style.left = "auto";
      } else {
        tooltipRef.current.style.left = `${tooltipLeft}px`;
        tooltipRef.current.style.right = "auto";
      }
    }
  }, [
    y,
    axisLeftPosition,
    xStart,
    xEnd,
    legislature,
    party,
    tooltipLeft,
    chartWidth
  ]);

  // Calculate the party percentage and the coalition percentage
  const partyPercentage = (party.deputes / legislature.total_deputes) * 100;
  const coalitionPercentage = party.coalition
    ? (coalitionDatas.deputies / legislature.total_deputes) * 100
    : 0;

  // On percentage button click, display number of deputies
  const [isPercentage, setIsPercentage] = useState(true);
  const handlePercentageClick = () => setIsPercentage(!isPercentage);

  // Set the width of the coalition name
  const partyLineRef = useRef<HTMLDivElement | null>(null);
  const [coalitionMaxWidth, setCoalitionMaxWidth] = useState(0);
  useEffect(() => {
    if (partyLineRef.current) {
      setCoalitionMaxWidth(partyLineRef.current.offsetWidth);
    }
  }, [party, party.coalition]);

  return (
    <div
      ref={tooltipRef}
      className="absolute pb-2 flex justify-start transition-all duration-500 select-none"
      onMouseEnter={() => setTooltipContent({ chartWidth, ...tooltipContent })}
      onMouseLeave={() => setTooltipContent(null)}
    >
      <div className="py-1.5 px-[5px] rounded-xl flex flex-col gap-1.5 bg-white shadow-md z-30 border border-black/5">
        {/* Year and current name */}
        <div className="flex gap-2 justify-start items-center">
          {party.current && (
            <Badge
              name={currentName}
              hex={party.current.color}
              onClick={() => setDetailsContent({ entity: party.current })}
            />
          )}
        </div>

        {/* Party name and percentage */}
        <div
          ref={partyLineRef}
          className="flex gap-2 justify-between items-center w-min sm:w-auto"
        >
          <EntityButton
            entity={party}
            onClick={() =>
              setDetailsContent({
                entity: party.current.parties.find(
                  (p) => p.name === party.name
                ),
                parent: party.current
              })
            }
            isActive={true}
          />
          <PercentageButton
            percentage={partyPercentage}
            deputies={party.deputes}
            totalDeputies={legislature.total_deputes}
            isPercentage={isPercentage}
            onHover={handlePercentageClick}
          />
        </div>

        {/* Coalition name and percentage */}
        {party.coalition && (
          <div
            className="flex gap-2 justify-between items-center sm:!max-w-none"
            style={{ maxWidth: coalitionMaxWidth }}
          >
            <div className="flex gap-1.5 items-center pl-0.5">
              <span
                className="size-2 rounded-full inline-block mt-0.5 shrink-0"
                style={{ backgroundColor: coalitionDatas.color }}
              ></span>
              <span className="text-sm sm:text-base text-black/50 leading-none inline sm:text-nowrap">
                {coalitionName}
              </span>
            </div>
            <PercentageButton
              percentage={coalitionPercentage}
              deputies={coalitionDatas.deputies}
              totalDeputies={legislature.total_deputes}
              isPercentage={isPercentage}
              onHover={handlePercentageClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
