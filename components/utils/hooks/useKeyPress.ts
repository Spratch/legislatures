"use client";

import { useEffect } from "react";

type KeyPressHandler = (event: KeyboardEvent) => void;

const useKeyPress = (
  targetKey: string | string[],
  handler: KeyPressHandler
) => {
  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent) => {
      const noModifierKeys = !event.ctrlKey && !event.altKey && !event.metaKey; // Keep shift for [+] key?

      if (
        noModifierKeys &&
        (event.key === targetKey ||
          (Array.isArray(targetKey) && targetKey.includes(event.key)))
      ) {
        handler(event);
      }
    };

    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [targetKey, handler]);
};

export default useKeyPress;
