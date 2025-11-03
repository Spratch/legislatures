export default function getYear(date: number): string {
  return date.toString().split(".")[0];
}
