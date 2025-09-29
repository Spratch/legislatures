"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  index: number;
  countryInfos: {
    key: string;
    title: string;
    description: string;
    image: string;
  };
  lang: string;
};

export default function CountryThumbnail({ index, countryInfos, lang }: Props) {
  // Tilt effect
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    const buffer = 20;

    if (x < buffer || x > width - buffer || y < buffer || y > height - buffer) {
      return;
    }

    const rotateX = (y / height - 0.5) * -25; // Ajustez l'angle selon vos besoins
    const rotateY = (x / width - 0.5) * 25; // Ajustez l'angle selon vos besoins

    setTilt({ rotateX, rotateY });
  };

  return (
    <Link
      href={`/${lang}/${countryInfos.key}`}
      className="border border-black/10 hover:border-black/20 rounded-xl transition shadow-md sm:shadow-sm sm:hover:shadow-lg overflow-hidden absolute aspect-video w-80 sm:w-[30rem]"
      style={{
        transform: `
                rotateX(${tilt.rotateX + index * 5}deg)
                rotateY(${tilt.rotateY - index * 10}deg)
                translateZ(${index * 10}px)
                translateX(${-index * 70}px)
                translateY(${index * 50}px)
            `,
        transition: "transform 0.5s linear",
        zIndex: -index,
        filter: `blur(${index * 0.5}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseOut={() => setTilt({ rotateX: 0, rotateY: 0 })}
    >
      <Image
        src={countryInfos.image}
        alt=""
        width={500}
        height={300}
        className="h-full w-full object-cover object-top p-px"
      />
      <div
        className="absolute top-0 bottom-0 left-0 right-0"
        style={{
          inset: 0,
          backdropFilter: "blur(20px)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%)"
        }}
      ></div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-y-0.5 gap-x-5 pb-2.5 sm:pb-5 pt-20 px-2.5 sm:px-6 absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black to-transparent">
        <h2 className="text-lg sm:text-xl leading-none tracking-wide">
          {countryInfos.title}
        </h2>
        <p className="text-sm sm:text-base text-white/80">
          {countryInfos.description}
        </p>
      </div>
    </Link>
  );
}
