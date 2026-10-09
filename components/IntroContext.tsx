"use client";

import { createContext, useContext } from "react";

/** True once the preloader has lifted, so above-the-fold motion can start. */
export const IntroContext = createContext(true);

export function useIntroReady() {
  return useContext(IntroContext);
}
