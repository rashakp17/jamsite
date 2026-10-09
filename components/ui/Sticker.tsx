"use client";

import { useId } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface StickerProps {
  text: string;
  className?: string;
  /** Background and text colours of the badge */
  bg?: string;
  fg?: string;
  children?: React.ReactNode;
}

/** Round badge with text running around its edge. It spins slowly and speeds along with scroll. */
export function Sticker({ text, className = "", bg = "var(--color-butter)", fg = "var(--color-ink)", children }: StickerProps) {
  const id = useId();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (v) => v * 0.15);

  return (
    <div className={`relative grid aspect-square place-items-center rounded-full ${className}`} style={{ backgroundColor: bg, color: fg }}>
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
        <g style={{ animation: "spin-slow 18s linear infinite", transformOrigin: "100px 100px" }}>
          <defs>
            <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
          </defs>
          <text fill="currentColor" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: 3 }}>
            <textPath href={`#${id}`}>{text}</textPath>
          </text>
        </g>
      </motion.svg>
      <span className="relative">{children}</span>
    </div>
  );
}

export function Stars({ className = "h-4 w-4", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label="5 out of 5 stars" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={className} fill={color} aria-hidden>
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </span>
  );
}
