"use client";

import { useEffect, useState } from "react";
import { animate, AnimatePresence, motion } from "motion/react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { easeExpo, easeSoft } from "./ui/motion";

const SEEN_KEY = "bb-intro-seen";

/** Wavy surface that sits on top of the rising jam and drifts sideways. */
function Wave() {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute bottom-full left-0 h-10 w-[200%] sm:h-14" aria-hidden>
      <motion.path
        d="M0 30 C150 0 300 60 450 30 C600 0 750 60 900 30 C1050 0 1200 60 1350 30 C1500 0 1650 60 1800 30 C1950 0 2100 60 2250 30 C2400 0 2550 60 2700 30 V60 H0 Z"
        fill="var(--color-jam)"
        animate={{ x: [0, -900] }}
        transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
      />
    </svg>
  );
}

/** First-visit intro: the screen fills with jam to 100%, then the whole jar lifts away. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  useBodyScrollLock(visible);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: just play the intro */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip the intro on repeat visits
      setVisible(false);
      onDone();
      return;
    }
    window.scrollTo(0, 0);
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        window.setTimeout(() => {
          setVisible(false);
          onDone();
        }, 200);
      },
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden
          className="fixed inset-0 z-[95] overflow-hidden bg-cream"
          exit={{ y: "-100%", borderBottomLeftRadius: "50% 20%", borderBottomRightRadius: "50% 20%" }}
          transition={{ duration: 1, ease: easeExpo }}
        >
          {/* rising jam */}
          <div className="absolute inset-x-0 bottom-0 bg-jam" style={{ height: `${count}%` }}>
            <Wave />
          </div>

          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeSoft }}
              className={`font-display text-[clamp(4rem,15vw,11rem)] font-extrabold leading-none tracking-[-0.06em] tabular-nums transition-colors duration-300 ${
                count > 45 ? "text-cream" : "text-ink"
              }`}
            >
              {count}
              <span className="text-[0.4em]">%</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`mt-2 text-lg font-semibold transition-colors duration-300 ${count > 52 ? "text-cream" : "text-ink"}`}
            >
              Filling the jars…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
