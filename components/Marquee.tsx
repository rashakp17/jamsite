"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** A row that drifts on its own, speeds up with scroll velocity and flips with scroll direction. */
function VelocityRow({ baseVelocity, children }: { baseVelocity: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    base.set(base.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="flex shrink-0 flex-nowrap">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`mx-[0.35em] inline-block h-[0.7em] w-[0.7em] shrink-0 ${className}`} aria-hidden>
      <path d="M20 0c1.6 10.4 9.6 18.4 20 20-10.4 1.6-18.4 9.6-20 20-1.6-10.4-9.6-18.4-20-20C10.4 18.4 18.4 10.4 20 0z" fill="currentColor" />
    </svg>
  );
}

const rowA = ["Real fruit", "Cane sugar", "Fresh lemon", "Nothing else"];
const rowB = ["Small batch", "Slow cooked", "Made in Pune", "No preservatives"];

/** Two ticker bands that cross each other at a slight angle. */
export function Marquee({ single = false }: { single?: boolean }) {
  const line = (words: string[], starClass: string) =>
    words.map((w) => (
      <span key={w} className="flex items-center">
        {w}
        <Star className={starClass} />
      </span>
    ));

  return (
    <section
      aria-label="Real fruit, cane sugar, fresh lemon, nothing else. Small batch, slow cooked, made in Pune."
      className={`relative overflow-hidden ${single ? "py-6" : "py-12 sm:py-16"}`}
    >
      {!single && (
        <div className="relative z-0 rotate-[2deg] scale-110 bg-butter py-2.5 font-display text-[clamp(1.4rem,3vw,2.75rem)] font-extrabold leading-tight tracking-[-0.04em] text-ink sm:py-4">
          <VelocityRow baseVelocity={2}>{line(rowB, "text-jam")}</VelocityRow>
        </div>
      )}
      <div
        className={`relative z-10 bg-jam py-2.5 font-display text-[clamp(1.4rem,3vw,2.75rem)] font-extrabold leading-tight tracking-[-0.04em] text-cream shadow-[0_20px_40px_-20px_rgba(43,15,20,0.5)] sm:py-4 ${
          single ? "" : "-mt-10 -rotate-[2deg] scale-110 sm:-mt-12"
        }`}
      >
        <VelocityRow baseVelocity={-2}>{line(rowA, "text-butter")}</VelocityRow>
      </div>
    </section>
  );
}
