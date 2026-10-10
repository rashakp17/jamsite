"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { formatPrice, products } from "@/lib/products";
import { useCart } from "./cart/CartContext";
import { useIntroReady } from "./IntroContext";
import { Sticker, Stars } from "./ui/Sticker";
import { RevealText, easeExpo, easeSoft } from "./ui/motion";

const AUTOPLAY = 2;

/** Full-screen flavour stage: colour, jar and giant word all change together. */
export function Hero() {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const { add } = useCart();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [added, setAdded] = useState(false);
  const jarRef = useRef<HTMLDivElement>(null);
  const product = products[index];
  const word = product.name.split(" ")[0].toUpperCase();

  useEffect(() => {
    if (!ready || paused || reduce) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % products.length), AUTOPLAY * 1000);
    return () => window.clearTimeout(id);
  }, [index, paused, ready, reduce]);

  // Jar follows the pointer a little, with a gentle 3D tilt.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Flat 2D sway only: 3D tilt plus drop-shadow gets clipped by some GPUs in Chrome.
  const rot = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 });
  const shiftY = useSpring(useTransform(py, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 20 });
  const shiftX = useSpring(useTransform(px, [-0.5, 0.5], [-24, 24]), { stiffness: 80, damping: 20 });

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);

  const onAdd = () => {
    add(product.slug, 1, jarRef.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.section
      ref={ref}
      aria-labelledby="hero-heading"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        px.set(0);
        py.set(0);
      }}
      initial={false}
      animate={{ backgroundColor: product.palette.bold, color: product.palette.on }}
      transition={{ duration: 0.9, ease: easeSoft }}
      className="relative overflow-hidden rounded-b-[2.5rem] pb-10 pt-24 sm:rounded-b-[3rem] lg:flex lg:min-h-[88svh] lg:flex-col lg:justify-center lg:pb-16 lg:pt-28"
    >
      {/* giant flavour word behind everything */}
      <motion.div style={{ y: wordY }} aria-hidden className="pointer-events-none absolute inset-x-0 top-[30%] select-none lg:top-[22%]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={word}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: "0%", opacity: 0.16 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.9, ease: easeSoft }}
            className="whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-none tracking-[-0.06em]"
          >
            {word}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <div className="container-page relative grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-6">
        {/* copy */}
        <div className="relative z-10 lg:col-span-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.2, ease: easeSoft }}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Stars className="h-4 w-4" /> 4.9 from 2,400+ breakfasts
          </motion.p>
          <RevealText
            as="h1"
            id="hero-heading"
            play={ready}
            delay={0.25}
            text="Spread a little happiness."
            accentWords={[3]}
            accentClassName="accent"
            className="mt-5 text-[clamp(2.6rem,5vw,5rem)] leading-[0.92]"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 0.85, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.7, ease: easeSoft }}
            className="mt-5 max-w-sm leading-snug"
          >
            Real fruit, cane sugar and lemon. Slow-cooked by hand in tiny batches in Pune.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.85, ease: easeSoft }}
            className="mt-8"
          >
            <Link
              href="/products"
              className="group inline-flex h-12 items-center gap-3 rounded-full px-6 text-[0.9rem] font-semibold transition-transform duration-500 ease-[var(--ease-spring)] hover:-translate-y-0.5"
              style={{ backgroundColor: product.palette.on, color: product.palette.bold }}
            >
              <span className="roll">
                <span>Shop all jams</span>
                <span aria-hidden>Shop all jams</span>
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* jar stage */}
        <motion.div style={{ y: stageY }} className="relative lg:col-span-4">
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={ready ? { y: 0, opacity: 1 } : undefined}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
            className="relative mx-auto w-[62%] max-w-[20rem] lg:w-full"
          >
            {/* soft glow disc behind the jar */}
            <div aria-hidden className="absolute inset-x-[4%] top-[8%] aspect-square rounded-full bg-current opacity-[0.08]" />

            <motion.div ref={jarRef} style={{ rotate: rot, x: shiftX, y: shiftY }} className="relative aspect-[4/5]">
              {/* gentle idle bob */}
              <motion.div
                className="absolute inset-0"
                animate={reduce ? undefined : { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={product.slug}
                    className="absolute inset-0"
                    initial={{ y: "-70%", rotate: -25, scale: 0.6, opacity: 0 }}
                    animate={{ y: "0%", rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ y: "60%", rotate: 20, scale: 0.7, opacity: 0, transition: { duration: 0.45, ease: easeExpo } }}
                    transition={{ type: "spring", stiffness: 110, damping: 13 }}
                  >
                    <Image
                      src={product.cutout}
                      alt={`A jar of ${product.name}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 30vw, 74vw"
                      className="object-contain drop-shadow-[0_40px_35px_rgba(43,15,20,0.45)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
            {/* contact shadow that breathes with the bob */}
            <motion.div
              aria-hidden
              className="mx-auto -mt-4 h-6 w-[60%] rounded-[50%] bg-ink/35 blur-xl"
              animate={reduce ? undefined : { scaleX: [1, 0.85, 1], opacity: [0.9, 0.6, 0.9] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={ready ? { scale: 1, rotate: 0 } : undefined}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 1 }}
            className="absolute -left-2 bottom-6 w-24 sm:w-28 lg:-left-6 lg:w-28"
          >
            <Sticker text="SMALL BATCH • HANDMADE IN PUNE • " className="w-full shadow-xl">
              <span className="font-display text-xl font-extrabold leading-none">
                100%
                <br />
                <span className="text-sm font-bold">fruit</span>
              </span>
            </Sticker>
          </motion.div>
        </motion.div>

        {/* current jar + switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.9, ease: easeSoft }}
          className="relative z-10 lg:col-span-3 lg:col-start-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: easeSoft }}
            >
              <div className="flex flex-wrap gap-2">
                {product.badge && (
                  <span className="tag" style={{ backgroundColor: product.palette.on, color: product.palette.bold }}>
                    {product.badge}
                  </span>
                )}
                {product.notes.map((n) => (
                  <span key={n} className="tag border-2 border-current/30">
                    {n}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold leading-none tracking-[-0.04em] sm:text-4xl">{product.name}</p>
              <p className="mt-2 text-sm leading-snug opacity-80">{product.tagline}</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-display text-2xl font-extrabold">{formatPrice(product.price)}</span>
                <button
                  type="button"
                  onClick={onAdd}
                  aria-label={`Add ${product.name} to bag`}
                  className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-90 hover:scale-110 active:scale-95"
                  style={{ backgroundColor: product.palette.on, color: product.palette.bold }}
                >
                  {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div role="tablist" aria-label="Choose a flavour" className="mt-8 grid grid-cols-4 gap-2">
            {products.map((p, i) => {
              const active = i === index;
              return (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={p.name}
                  onClick={() => setIndex(i)}
                  className="group flex flex-col items-center gap-2"
                >
                  <span className="relative grid h-12 w-12 place-items-center">
                    <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden>
                      <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                      {active && (
                        <motion.circle
                          key={`${index}-${paused}`}
                          cx="28"
                          cy="28"
                          r="26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: paused || reduce ? 1 : 1 }}
                          transition={{ duration: paused || reduce ? 0.3 : AUTOPLAY, ease: "linear" }}
                        />
                      )}
                    </svg>
                    <span
                      className="relative h-8 w-8 overflow-hidden rounded-full border-2 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110"
                      style={{ borderColor: p.palette.on, backgroundColor: p.palette.bold }}
                    >
                      <Image src={p.cutout} alt="" fill sizes="36px" className="object-contain p-0.5" />
                    </span>
                  </span>
                  <span className={`text-[0.65rem] font-semibold transition-opacity ${active ? "opacity-100" : "opacity-60"}`}>
                    {p.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
