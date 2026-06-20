export enum CountryEnum {
  "france" = "France",
  "germany" = "Germany",
  "ddr" = "DDR",
  "uk" = "United Kingdom"
}

export type Country = keyof typeof CountryEnum;
