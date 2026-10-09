"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/smoothScroll";

/** Inertial page scrolling via Lenis. Skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -80 } });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New page: jump to the top (or the hash target) without easing through the old page.
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    lenis.scrollTo(target ?? 0, { immediate: true, offset: target ? -80 : 0, force: true });
  }, [pathname]);

  return null;
}
