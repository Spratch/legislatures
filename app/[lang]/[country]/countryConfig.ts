import "server-only";
import { CountryDataType } from "@/types/countryData";
import { CountryEnum } from "@/types/countriesEnum";

export const getCountryData = async (
  country: keyof typeof CountryEnum
): Promise<CountryDataType> => {
  const [events, families, infos, regimes] = await Promise.all([
    import(`@/public/data/${country}/events.json`).then(
      (module) => module.default
    ),
    import(`@/public/data/${country}/families.json`).then(
      (module) => module.default
    ),
    import(`@/public/data/${country}/infos.json`).then(
      (module) => module.default
    ),
    import(`@/public/data/${country}/regimes.json`).then(
      (module) => module.default
    )
  ]);
  return { events, families, infos, regimes };
};
