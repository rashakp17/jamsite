"use client";

import { useEffect } from "react";
import { getLenis } from "./smoothScroll";

let locks = 0;

/** Prevents the page behind an overlay from scrolling while `active`. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    getLenis()?.stop();
    return () => {
      locks -= 1;
      if (locks === 0) {
        body.style.overflow = "";
        body.style.paddingRight = "";
        getLenis()?.start();
      }
    };
  }, [active]);
}
