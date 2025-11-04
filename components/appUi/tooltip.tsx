import { TooltipContentType } from "@/types/tooltipContent";
import { detailsContentAtom, tooltipContentAtom } from "@/utils/contexts/atoms";
import { useDictionary } from "@/utils/contexts/dictionaryContext";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { getLangKey } from "../utils/getLangKey";
import Badge from "./badge";
import EntityButton from "./entityButton";
import PercentageButton from "./percentageButton";

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
  const setDetailsContent = useSetAtom(detailsContentAtom);
  const { y, xStart, xEnd, legislature, party, coalitionData } = tooltipContent;

  const lang = useDictionary().locale.lang;

  const currentName = party.current[getLangKey("name", lang)];
  const coalitionName = party.coalition
    ? party[getLangKey("coalition", lang)] || party.coalition
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
  const partyPercentage = (party.deputies / legislature.total_deputies) * 100;
  const coalitionPercentage = party.coalition
    ? (coalitionData.deputies / legislature.total_deputies) * 100
    : 0;

  // On percentage button click, display number of deputies
  const [isPercentage, setIsPercentage] = useState(true);
  const handlePercentageClick = () => setIsPercentage(!isPercentage);

  return (
    <div
      ref={tooltipRef}
      className="absolute flex select-none justify-start pb-2 transition-all duration-500"
      onMouseEnter={() => setTooltipContent({ chartWidth, ...tooltipContent })}
      onMouseLeave={() => setTooltipContent(null)}
    >
      <div className="z-30 flex flex-col gap-1.5 rounded-xl border border-black/5 bg-white px-[5px] py-1.5 shadow-md">
        {/* Year and current name */}
        <div className="flex items-center justify-start gap-2">
          {party.current && (
            <Badge
              name={currentName}
              hex={party.current.color}
              onClick={() => setDetailsContent({ entity: party.current })}
            />
          )}
        </div>

        {/* Party name and percentage */}
        <div className="flex items-center justify-between gap-2">
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
            deputies={party.deputies}
            totalDeputies={legislature.total_deputies}
            isPercentage={isPercentage}
            onHover={handlePercentageClick}
            isMostImportant={party.isMostImportantEntity}
          />
        </div>

        {/* Coalition name and percentage */}
        {party.coalition && (
          <div className="flex items-center justify-between gap-2 sm:!max-w-none">
            <div className="flex items-center gap-1.5 pl-0.5">
              <span
                className="mt-0.5 inline-block size-2 shrink-0 rounded-full"
                style={{ backgroundColor: coalitionData.color }}
              ></span>
              <span className="inline overflow-hidden text-nowrap text-sm leading-none text-black/50 max-sm:max-w-[25ch] max-sm:text-ellipsis sm:text-base">
                {coalitionName}
              </span>
            </div>
            <PercentageButton
              percentage={coalitionPercentage}
              deputies={coalitionData.deputies}
              totalDeputies={legislature.total_deputies}
              isPercentage={isPercentage}
              onHover={handlePercentageClick}
              isMostImportant={coalitionData.isMostImportantEntity}
            />
          </div>
        )}
      </div>
    </div>
  );
}
