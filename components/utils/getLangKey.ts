export const getLangKey = (key: string, lang: string) =>
  `${key}${lang === "fr" ? "" : "_" + lang}`;
