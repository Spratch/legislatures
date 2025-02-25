import "server-only";
import fs from "fs";
import path from "path";
import { CountryType } from "@/types/country";

const files = ["families", "events", "regimes"] as const;
type FileType = (typeof files)[number];

const generateCountryData = (countryCode: string) => {
  return files.reduce(
    (acc, file) => ({
      ...acc,
      [file]: () => {
        const filePath = path.join(
          process.cwd(),
          "public",
          "data",
          countryCode,
          `${file}.json`
        );
        console.log(`Trying to read: ${filePath}`);
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${path}`);
        }
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        // return import(path).then((module) => module.default);
      }
    }),
    {}
  );
};

const countryConfig = {
  france: generateCountryData("france"),
  germany: generateCountryData("germany")
};

export async function getCountryData(
  countryCode: string
): Promise<CountryType> {
  const data = countryConfig[countryCode];
  if (!data) {
    throw new Error(`Country data not found for ${countryCode}`);
  }

  const result = await Promise.all(
    files.map(async (file: FileType) => ({
      [file]: await data[file]()
    }))
  );

  return result.reduce((acc, item) => ({ ...acc, ...item }), {}) as CountryType;
}
