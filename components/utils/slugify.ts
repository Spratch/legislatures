export default function slugify(str: string) {
  if (!str) return "";

  return str
    .toLowerCase()
    .trim()
    .normalize("NFD") // remove accents from charaters
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ") // replace invalid chars with spaces
    .trim()
    .replace(/[\s-]+/g, "-") // replace multiple spaces or hyphens with a single hyphen
    .replace(/^-+|-+$/g, "");
}
