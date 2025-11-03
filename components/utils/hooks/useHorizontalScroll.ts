import { useEffect, useRef } from "react";

export const useHorizontalScroll = <T extends HTMLElement>() => {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    const element = scrollRef.current;

    const handleScroll = (e: WheelEvent) => {
      if (element && e.deltaY !== 0) {
        // Scroll horizontally
        element.scrollLeft += e.deltaY;
        // Prevent vertical scroll
        e.preventDefault();
      }
    };

    if (element) {
      element.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  return scrollRef;
};
