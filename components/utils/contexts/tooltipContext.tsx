"use client";

import { atom } from "jotai";
import { TooltipContentType } from "../../../types/tooltipContent";

export const tooltipContentAtom = atom<TooltipContentType>(
  null as TooltipContentType
);
