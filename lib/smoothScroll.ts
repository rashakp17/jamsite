import type Lenis from "lenis";

/** The page's single Lenis instance, shared so overlays can pause it. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Scrolls to a y-position or element, smoothly when Lenis is running. */
export function scrollTo(target: number | string | HTMLElement, immediate = false) {
  if (instance) {
    instance.scrollTo(target, { immediate, offset: typeof target === "number" ? 0 : -80 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}
