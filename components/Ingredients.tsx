"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RevealText, easeExpo } from "./ui/motion";

const ingredients = [
  { name: "Real fruit", detail: "62%+ of every jar", image: "/images/strawberries-dark.webp", ring: "bg-jam" },
  { name: "Cane sugar", detail: "Unrefined, from Kolhapur", image: "/images/cane-sugar.webp", ring: "bg-butter" },
  { name: "Fresh lemon", detail: "Sets it naturally", image: "/images/lemons.webp", ring: "bg-mango" },
  { name: "Whole spices", detail: "Cardamom, rose, pepper", image: "/images/spices.webp", ring: "bg-pink" },
];

const notInside = ["Preservatives", "Pectin", "Artificial colours", "Corn syrup"];

export function Ingredients() {
  return (
    <section id="ingredients" aria-labelledby="ingredients-heading" className="scroll-mt-24 px-3 py-6 sm:px-4">
      <div className="rounded-[2.5rem] bg-cream-deep py-20 sm:rounded-[4rem] sm:py-28">
        <div className="container-page text-center">
          <span className="tag bg-ink text-cream">What goes in</span>
          <RevealText
            id="ingredients-heading"
            text="Only four things. Promise."
            accentWords={[3]}
            className="mx-auto mt-4 max-w-4xl text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
          />

          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {ingredients.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 60, rotate: i % 2 ? 6 : -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[12.5rem]">
                  <div
                    className={`absolute inset-0 rounded-full ${item.ring} transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-105`}
                  />
                  <div className="absolute inset-[7%] overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 18vw, 44vw"
                      className="object-cover transition-transform duration-1000 ease-[var(--ease-soft)] group-hover:rotate-6 group-hover:scale-110"
                    />
                  </div>
                  <span className="absolute -right-1 top-2 grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-lg font-extrabold text-cream shadow-lg">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl leading-none sm:text-3xl">{item.name}</h3>
                <p className="mt-2 font-medium text-ink-soft">{item.detail}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col items-center gap-5">
            <p className="font-display text-xl font-extrabold tracking-[-0.03em]">And never, ever:</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {notInside.map((n, i) => (
                <li
                  key={n}
                  className="relative rounded-full border-2 border-ink/15 bg-cream px-4 py-2 font-semibold text-ink-soft"
                  style={{ rotate: `${i % 2 ? 2 : -2}deg` }}
                >
                  {n}
                  <motion.span
                    aria-hidden
                    className="absolute left-3 right-3 top-1/2 h-[3px] origin-left rounded-full bg-jam"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: easeExpo }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
