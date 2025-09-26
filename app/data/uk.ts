import events from "@/public/data/uk/events.json";
import families from "@/public/data/uk/families.json";
import infos from "@/public/data/uk/infos.json";
import regimes from "@/public/data/uk/regimes.json";
import { CountryDataType } from "@/types/countryData";

const data: CountryDataType = {
  events,
  families,
  infos,
  regimes
};

export default data;
