"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { RevealText } from "./ui/motion";

const steps = [
  {
    title: "Picked properly ripe",
    text: "Straight from six family farms in Mahabaleshwar, Ratnagiri and the Nilgiris.",
    stat: "6 farms",
    image: "/images/process/step-1-handpicked.jpg",
    bg: "var(--color-butter)",
    fg: "var(--color-ink)",
  },
  {
    title: "Stirred in copper",
    text: "Low flame, wooden spoon, about forty minutes, until it sets on a cold plate.",
    stat: "40 min",
    image: "/images/process/step-2-copper-pan.jpg",
    bg: "var(--color-jam)",
    fg: "var(--color-cream)",
  },
  {
    title: "Tiny batches only",
    text: "Never more than 12 kg in a pot, so the colour stays bright and the fruit keeps its bite.",
    stat: "≤ 12 kg",
    image: "/images/process/step-3-small-batch.jpg",
    bg: "var(--color-pink)",
    fg: "var(--color-ink)",
  },
  {
    title: "Sealed the same day",
    text: "Poured hot into glass, sealed straight away and numbered by hand.",
    stat: "48 hrs",
    image: "/images/process/step-4-sealed-fresh.jpg",
    bg: "var(--color-plum)",
    fg: "var(--color-cream)",
  },
];

function Step({ step, index, progress }: { step: (typeof steps)[number]; index: number; progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const total = steps.length;
  // As later cards slide over, earlier ones shrink back into the stack.
  const scale = useTransform(progress, [index / total, 1], [1, reduce ? 1 : 1 - (total - index - 1) * 0.05]);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const imageScale = useTransform(enter, [0, 1], reduce ? [1, 1] : [1.3, 1]);
  const tilt = useTransform(enter, [0, 1], reduce ? [0, 0] : [index % 2 ? 4 : -4, 0]);

  return (
    <div ref={ref} className="sticky top-0 flex h-svh items-start pt-[16svh]">
      <motion.article
        style={{ scale, rotate: tilt, top: index * 26, backgroundColor: step.bg, color: step.fg }}
        className="relative grid h-[64svh] w-full origin-top grid-rows-[1fr_auto] gap-4 overflow-hidden rounded-[2rem] p-4 sm:rounded-[2.5rem] sm:p-5 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8"
      >
        <div className="order-2 flex flex-col justify-end gap-6 p-2 sm:p-4 lg:order-1 lg:p-8">
          <span className="font-display text-[clamp(3.5rem,7vw,6.5rem)] font-extrabold leading-[0.8] tracking-[-0.06em] opacity-90">
            0{index + 1}
          </span>
          <div>
            <span className="tag border-2 border-current">{step.stat}</span>
            <h3 className="mt-4 text-[clamp(1.8rem,2.8vw,2.75rem)] leading-[0.95]">{step.title}</h3>
            <p className="mt-3 max-w-md text-[0.95rem] leading-snug opacity-85">{step.text}</p>
          </div>
        </div>
        <div className="relative order-1 min-h-0 overflow-hidden rounded-[1.5rem] lg:order-2 lg:rounded-[2rem]">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0">
            <Image src={step.image} alt={step.title} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}

export function Process() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });

  return (
    <section aria-labelledby="process-heading" className="relative pt-20 sm:pt-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="tag bg-butter text-ink">From farm to jar in 48 hours</span>
            <RevealText
              id="process-heading"
              text="How the magic happens."
              accentWords={[3]}
              className="mt-4 max-w-4xl text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
            />
          </div>
        </div>

        <div ref={listRef} className="pb-[4svh]">
          {steps.map((s, i) => (
            <Step key={s.title} step={s} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
