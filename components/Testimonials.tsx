"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Stars } from "./ui/Sticker";
import { RevealText } from "./ui/motion";

const reviews = [
  { quote: "Tastes like summer in a jar. You can taste the Mahabaleshwar strawberries in every bite.", name: "Ananya", place: "Bengaluru", jar: "Strawberry Bliss", bg: "bg-jam", fg: "text-cream" },
  { quote: "The Raspberry Rose is the only reason my croissants get eaten before noon.", name: "Kabir", place: "Mumbai", jar: "Raspberry Rose", bg: "bg-pink", fg: "text-ink" },
  { quote: "Mango Sunshine on a hot paratha took me straight back to my nani's verandah.", name: "Meher", place: "Delhi", jar: "Mango Sunshine", bg: "bg-mango", fg: "text-ink" },
  { quote: "My kids fight over the last spoon of Mixed Berry every single weekend.", name: "Rohan", place: "Pune", jar: "Mixed Berry", bg: "bg-plum", fg: "text-cream" },
  { quote: "Finally a jam that isn't just sugar. You can see actual pieces of fruit!", name: "Isha", place: "Hyderabad", jar: "Strawberry Bliss", bg: "bg-butter", fg: "text-ink" },
  { quote: "Gifted the Breakfast Box to my parents. They've already ordered two more.", name: "Arjun", place: "Chennai", jar: "Breakfast Box", bg: "bg-cream-deep", fg: "text-ink" },
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ items, speed }: { items: typeof reviews; speed: number }) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const base = useMotionValue(0);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const factor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // ease to a stop on hover rather than freezing abruptly
    factor.current += ((paused ? 0 : 1) - factor.current) * 0.08;
    base.set(base.get() + speed * factor.current * (delta / 1000));
  });

  return (
    <div className="overflow-hidden" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <motion.ul style={{ x }} className="flex w-max gap-4 py-3 sm:gap-5">
        {[...items, ...items].map((r, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className={`flex w-[78vw] shrink-0 flex-col justify-between rounded-[1.75rem] p-6 transition-transform duration-500 ease-[var(--ease-spring)] hover:-rotate-1 hover:scale-[1.03] sm:w-[21rem] sm:p-7 ${r.bg} ${r.fg}`}
          >
            <div>
              <Stars className="h-5 w-5" />
              <p className="mt-5 font-display text-xl font-bold leading-[1.15] tracking-[-0.03em] sm:text-[1.3rem]">&ldquo;{r.quote}&rdquo;</p>
            </div>
            <div className="mt-8 flex items-center justify-between gap-3 text-sm font-semibold">
              <span>
                {r.name}, {r.place}
              </span>
              <span className="rounded-full border-2 border-current/30 px-3 py-1 text-xs">{r.jar}</span>
            </div>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden py-20 sm:py-28">
      <div className="container-page flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="tag bg-butter text-ink">
            <Stars className="h-3.5 w-3.5" /> 4.9 from 2,400+ reviews
          </span>
          <RevealText
            id="testimonials-heading"
            text="Breakfast tables agree."
            accentWords={[2]}
            className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
          />
        </div>
      </div>
      <div className="mt-10 space-y-1">
        <Row items={reviews.slice(0, 3).concat(reviews.slice(4, 5))} speed={-1.6} />
        <Row items={reviews.slice(3).concat(reviews.slice(1, 2))} speed={1.3} />
      </div>
    </section>
  );
}
