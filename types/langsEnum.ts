export enum LocaleEnum {
  "fr" = "Français",
  "en" = "English",
  "de" = "Deutsch"
}

export type Locale = keyof typeof LocaleEnum;
