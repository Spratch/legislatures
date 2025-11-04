import { CurrentType } from "@/types/current";
import { PartyType } from "@/types/party";

export const isPartyVisible = (
  partyName: PartyType["name"],
  visibleCurrents: CurrentType[]
) =>
  visibleCurrents.find((current) =>
    current.parties.find((p) => p.name === partyName)
  );

export const getPartyWidth = (
  graphWidth: number,
  deputies: number,
  totalDeputies: number
) => graphWidth * (deputies / totalDeputies) || 0;

export const getFilteredTotal = (
  parties: PartyType[],
  visibleCurrents: CurrentType[]
) =>
  parties.reduce((accumulator, party) => {
    if (isPartyVisible(party.name, visibleCurrents)) {
      return accumulator + party.deputies;
    } else {
      return accumulator;
    }
  }, 0);
