"use client";

import { useCallback, useState } from "react";
import { MotionConfig } from "motion/react";
import { CartProvider } from "./cart/CartContext";
import { CartDrawer } from "./cart/CartDrawer";
import { FlyToBag } from "./cart/FlyToBag";
import { Cursor } from "./Cursor";
import { IntroContext } from "./IntroContext";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  const [introReady, setIntroReady] = useState(false);
  const onIntroDone = useCallback(() => setIntroReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introReady}>
        <CartProvider>
          <SmoothScroll />
          {children}
          <FlyToBag />
          <CartDrawer />
          <Preloader onDone={onIntroDone} />
          <Cursor />
        </CartProvider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
