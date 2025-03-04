import { LegislatureType } from "./legislature";
import { PartyType } from "./party";

export type TooltipContentType = {
  chartWidth?: number;
  y: number;
  axisLeftPosition?: number;
  xStart: number;
  xEnd: number;
  legislature: LegislatureType;
  party: PartyType;
  coalitionDatas: {
    first: boolean;
    last: boolean;
    color: string;
    deputies: number;
  };
};
