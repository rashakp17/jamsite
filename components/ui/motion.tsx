"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

export const easeSoft = [0.22, 1, 0.36, 1] as const;
export const easeExpo = [0.76, 0, 0.24, 1] as const;

const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/** Fades and lifts its children into place once they scroll into view. */
export function Reveal({ delay = 0, y = 32, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 1.1, delay, ease: easeSoft }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span";

interface RevealTextProps {
  text: string;
  as?: HeadingTag;
  className?: string;
  /** Words (by index) set in the italic accent style */
  accentWords?: number[];
  accentClassName?: string;
  delay?: number;
  /** Animate when `play` turns true instead of on scroll */
  play?: boolean;
  stagger?: number;
  id?: string;
}

/** Headline that reveals word by word, each word rising out of a mask. */
export function RevealText({
  text,
  as = "h2",
  className,
  accentWords = [],
  accentClassName = "accent text-jam",
  delay = 0,
  play,
  stagger = 0.06,
  id,
}: RevealTextProps) {
  const words = text.split(" ");
  const trigger =
    play === undefined
      ? { whileInView: "show" as const, viewport: inViewOnce }
      : { animate: play ? ("show" as const) : ("hidden" as const) };

  const content = (
    <motion.span
      className="block"
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${accentWords.includes(i) ? accentClassName : ""}`}
              variants={{
                hidden: { y: "115%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 1.15, ease: easeSoft } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );

  return createElement(as, { className, id }, content);
}

function ScrollWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

/** Paragraph whose words light up one after another as it scrolls through the viewport. */
export function ScrollText({ text, className, id }: { text: string; className?: string; id?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  if (reduce) {
    return (
      <p ref={ref} id={id} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} id={id} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </ScrollWord>
      ))}
    </p>
  );
}

interface MaskImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Vertical drift of the image inside its frame while scrolling, in percent */
  parallax?: number;
  delay?: number;
  from?: "bottom" | "top" | "center";
  children?: ReactNode;
}

const clipFrom = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  center: "inset(18% 18% 18% 18%)",
};

/** Image that wipes open from an edge, settles from a slight zoom and drifts with scroll. */
export function MaskImage({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "object-cover",
  priority,
  parallax = 8,
  delay = 0,
  from = "bottom",
  children,
}: MaskImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = reduce ? 0 : parallax;
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`]);

  return (
    <motion.div
      ref={ref}
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`}
      initial={{ clipPath: clipFrom[from] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={inViewOnce}
      transition={{ duration: 1.4, delay, ease: easeExpo }}
    >
      <motion.div
        style={{ y }}
        className="absolute -inset-y-[10%] inset-x-0"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1.8, delay, ease: easeSoft }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imgClassName} />
      </motion.div>
      {children}
    </motion.div>
  );
}

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ to, suffix = "", prefix = "", duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, inViewOnce);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jump straight to the final value
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: easeSoft,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/** Pulls its child toward the cursor while hovered, then springs back. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** A thin rule that draws itself across when it scrolls into view. */
export function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-current opacity-20 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={inViewOnce}
      transition={{ duration: 1.6, delay, ease: easeExpo }}
    />
  );
}
