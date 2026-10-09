"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Sticker } from "./ui/Sticker";
import { RevealText } from "./ui/motion";

const pairings = ["Warm toast", "Hot parathas", "Thick yoghurt", "Butter croissants", "Pancakes", "Cheesecake"];
const chipColors = ["bg-butter text-ink", "bg-pink text-ink", "bg-cream text-ink", "bg-mango text-ink", "bg-jam text-cream", "bg-cream text-ink"];

/** Full-bleed food photo that grows to fill the screen as it scrolls in, with pairing chips that pop on. */
export function ToastMoment() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], ["4rem", "2rem"]);
  const { scrollYProgress: through } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(through, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section ref={ref} aria-labelledby="toast-heading" className="relative px-3 py-6 sm:px-4">
      <motion.div style={{ scale, borderRadius: radius }} className="relative h-[80svh] min-h-[520px] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute -inset-y-[12%] inset-x-0">
          <Image
            src="/images/hero-jam-toast.jpg"
            alt="Strawberry jam spread thick on toasted sourdough"
            fill
            sizes="100vw"
            className="object-cover object-[50%_60%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

        <div className="absolute right-5 top-5 w-24 sm:right-8 sm:top-8 sm:w-32">
          <Sticker text="BEST ON WARM TOAST • BEST ON WARM TOAST • " bg="var(--color-jam)" fg="var(--color-cream)" className="w-full shadow-2xl">
            <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" aria-hidden>
              <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </Sticker>
        </div>

        <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-cream sm:pb-14">
          <RevealText
            id="toast-heading"
            text="Made for warm toast."
            accentWords={[2]}
            accentClassName="accent text-butter"
            className="max-w-4xl text-[clamp(2.4rem,5.4vw,5.5rem)] leading-[0.92]"
          />
          <motion.ul
            className="mt-8 flex flex-wrap gap-2.5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }}
          >
            {pairings.map((p, i) => (
              <motion.li
                key={p}
                variants={{
                  hidden: { scale: 0, rotate: i % 2 ? 12 : -12 },
                  show: { scale: 1, rotate: i % 2 ? 2 : -2, transition: { type: "spring", stiffness: 300, damping: 16 } },
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${chipColors[i]}`}
              >
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
