import { GitHubLogoIcon } from "@radix-ui/react-icons";
import LangSelector from "./langSelector";
import Link from "next/link";

export default function HomeSettingsLine({ linkTitle }: { linkTitle: string }) {
  return (
    <section className="sticky top-0 z-10 mx-auto flex w-full max-w-screen-3xl items-end bg-opacity-45 bg-gradient-to-b from-white via-white/70 to-transparent p-2 pb-4">
      <div className="flex w-full justify-center gap-2">
        <div className="flex items-center gap-2">
          <LangSelector />

          <Link
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-950"
            href="https://github.com/Spratch/legislatures"
            target="_blank"
            title={linkTitle}
          >
            <GitHubLogoIcon className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
