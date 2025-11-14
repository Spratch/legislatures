import { atom } from "jotai";
import { DetailsContentType } from "../../../types/detailsContent";
import { TooltipContentType } from "../../../types/tooltipContent";

export const detailsContentAtom = atom<DetailsContentType>(
  null as DetailsContentType
);
export const tooltipContentAtom = atom<TooltipContentType>(
  null as TooltipContentType
);
export const coalitionsVisibilityAtom = atom<boolean>(false);
export const transitionsVisibilityAtom = atom<boolean>(true);
export const isPercentageAtom = atom<boolean>(true);
