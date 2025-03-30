import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function WikiLink({ href }: { href: string }) {
  const lang = href.split("/")[2].split(".")[0];
  return (
    <Link
      href={href}
      target="_blank"
      className="mt-2.5 text-sm small-caps group flex items-center gap-1 py-0.5 px-1.5 rounded-full border border-blue-200 hover:border-blue-500 text-blue-400 hover:text-blue-500 hover:bg-blue-50 transition"
    >
      <ExternalLinkIcon className="size-3.5 group-hover:scale-110 transition" />
      {lang === "fr" ? "Wikipédia" : "Wikipedia"}
    </Link>
  );
}
