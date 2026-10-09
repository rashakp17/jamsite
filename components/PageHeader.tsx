"use client";

import { motion } from "motion/react";
import { useIntroReady } from "./IntroContext";
import { RevealText, easeSoft } from "./ui/motion";

type Tone = "butter" | "pink" | "mango" | "jam" | "plum" | "cream";

const tones: Record<Tone, { bg: string; tag: string; accent: string }> = {
  butter: { bg: "bg-butter text-ink", tag: "bg-ink text-cream", accent: "accent text-jam" },
  pink: { bg: "bg-pink text-ink", tag: "bg-ink text-cream", accent: "accent text-jam" },
  mango: { bg: "bg-mango text-ink", tag: "bg-ink text-cream", accent: "accent text-plum" },
  jam: { bg: "bg-jam text-cream", tag: "bg-cream text-jam", accent: "accent text-butter" },
  plum: { bg: "bg-plum text-cream", tag: "bg-pink text-ink", accent: "accent text-pink" },
  cream: { bg: "bg-cream-deep text-ink", tag: "bg-ink text-cream", accent: "accent text-jam" },
};

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  accentWords?: number[];
  intro?: string;
  tone?: Tone;
  children?: React.ReactNode;
}

/** Colour-blocked page opener with a chunky headline and rounded bottom edge. */
export function PageHeader({ eyebrow, title, accentWords = [], intro, tone = "butter", children }: PageHeaderProps) {
  const ready = useIntroReady();
  const t = tones[tone];

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className={`relative overflow-hidden rounded-[2.5rem] pb-12 pt-28 sm:rounded-[3rem] sm:pb-16 sm:pt-32 ${t.bg}`}>
        <div className="container-page relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
            className={`tag ${t.tag}`}
          >
            {eyebrow}
          </motion.span>
          <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end">
            <RevealText
              as="h1"
              play={ready}
              delay={0.35}
              text={title}
              accentWords={accentWords}
              accentClassName={t.accent}
              className="text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[0.92] lg:col-span-9"
            />
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={ready ? { opacity: 0.85, y: 0 } : undefined}
                transition={{ duration: 1, delay: 0.8, ease: easeSoft }}
                className="max-w-sm leading-snug lg:col-span-3 lg:mb-3"
              >
                {intro}
              </motion.p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
