import Image from "next/image";
import Link from "next/link";

type Props = {
  countryInfos: {
    key: string;
    title: string;
    description: string;
    image: string;
  };
  lang: string;
};

export default function CountryThumbnail({ countryInfos, lang }: Props) {
  const isPast = countryInfos.description.startsWith("1");
  return (
    <Link
      href={`/${lang}/${countryInfos.key}`}
      className="group/thumbnail relative mx-auto aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-md transition hover:border-gray-300 sm:shadow-sm sm:hover:shadow-lg"
    >
      <Image
        src={countryInfos.image}
        alt=""
        width={500}
        height={300}
        className={`h-full w-full object-cover object-top p-px ${isPast ? "grayscale-[.75] transition duration-500 group-hover/thumbnail:grayscale-[.50] group-hover/thumbnail:duration-75 group-focus-visible/thumbnail:grayscale-[.50] group-focus-visible/thumbnail:duration-75" : ""}`}
      />
      <div
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{
          inset: 0,
          backdropFilter: "blur(20px)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%)"
        }}
      ></div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-between gap-x-5 gap-y-1 bg-gradient-to-t from-black to-transparent px-2.5 pb-2.5 pt-20 text-white lg:flex-row lg:items-end lg:px-6 lg:pb-5">
        <h2 className="text-base leading-none tracking-wide lg:text-xl">
          {countryInfos.title}
        </h2>
        <p className="text-sm text-white/80 lg:text-base">
          {countryInfos.description}
        </p>
      </div>
    </Link>
  );
}
