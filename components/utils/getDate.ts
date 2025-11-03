export default function getDate(date: string): number {
  if (date === "now") {
    // Return the date of today plus two years for better legibility
    return new Date().getTime() / (1000 * 60 * 60 * 24 * 365.25) + 1970 + 2;
  } else {
    // Return the number of years from first January 0 to the date
    return new Date(date).getTime() / (1000 * 60 * 60 * 24 * 365.25) + 1970;
  }
}
