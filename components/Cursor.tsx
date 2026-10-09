"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

type Mode = "default" | "hover" | "label" | "hidden";

const INTERACTIVE = "a, button, [role='tab'], summary, label, [data-cursor='hover']";
const TEXT_ENTRY = "input, textarea, select";

/**
 * Two-part cursor for fine pointers: a dot that tracks exactly and a ring that trails it.
 * Elements opt into a labelled bubble with `data-cursor="label"` and `data-cursor-label="View"`.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detected on the client only
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const labelled = el.closest<HTMLElement>("[data-cursor='label']");
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? "View");
        setMode("label");
      } else if (el.closest(TEXT_ENTRY)) setMode("hidden");
      else if (el.closest(INTERACTIVE)) setMode("hover");
      else setMode("default");
    };
    const onLeave = () => setMode("hidden");
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ring = mode === "hover" ? 56 : 34;

  return (
    <>
      {/* Blend layer: must be the top-level fixed element for difference blending to reach the page. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[99] mix-blend-difference">
        <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            animate={{
              width: ring,
              height: ring,
              opacity: mode === "hidden" || mode === "label" ? 0 : 1,
              scale: down ? 0.8 : 1,
              backgroundColor: mode === "hover" ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          />
        </motion.div>
        <motion.div style={{ x, y }} className="absolute left-0 top-0">
          <motion.div
            className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            animate={{ opacity: mode === "default" ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </div>

      {/* Labelled bubble, drawn without blending so it keeps the brand colour. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[99]">
        <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
          <AnimatePresence>
            {mode === "label" && (
              <motion.div
                key="bubble"
                className="grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-jam text-cream"
                initial={{ scale: 0 }}
                animate={{ scale: down ? 0.85 : 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
              >
                <span className="font-display text-lg">{label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
