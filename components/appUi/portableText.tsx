import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

const portableTextComponents: PortableTextComponents = {
  types: {},
  marks: {
    link: ({ children, value }) => (
      <Link
        href={value.href}
        target="_blank"
        className={`transition-opacity ${
          value.href.startsWith("mailto:")
            ? "text-blue-500 hover:opacity-70 transition-opacity"
            : "opacity-45 hover:opacity-70"
        }`}
      >
        {children}
      </Link>
    )
  },
  block: {
    lastParagraph: ({ children }) => (
      <p className="border-t border-black/30 pt-6 mt-4">{children}</p>
    )
  }
};

export default portableTextComponents;
