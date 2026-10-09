"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { RevealText, easeSoft } from "./ui/motion";

const faqs = [
  {
    q: "How long does a jar last?",
    a: "Unopened, twelve months in a cool cupboard. Once opened, keep it in the fridge and finish it within four weeks.",
  },
  {
    q: "Where do you ship?",
    a: "Anywhere in India. Orders leave the kitchen within two working days and usually arrive in three to five. Shipping is free over ₹999.",
  },
  {
    q: "Are your jams vegan?",
    a: "Yes. Every jar is just fruit, cane sugar, lemon and sometimes a spice. There's no gelatine, honey or dairy.",
  },
  {
    q: "Do you do corporate or wedding gifting?",
    a: "We do. Write to us with your dates and quantities and we'll put together custom boxes, labels and handwritten cards.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="tag bg-butter text-ink">Good to know</span>
          <RevealText
            id="faq-heading"
            text="Questions, answered."
            accentWords={[1]}
            className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
          />
        </div>
        <ul className="space-y-3 lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`rounded-[2rem] transition-colors duration-500 ${isOpen ? "bg-butter" : "bg-cream-deep"}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-7"
                  >
                    <span className="font-display text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${isOpen ? "bg-ink text-cream" : "bg-cream"}`}
                      aria-hidden
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.5} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: easeSoft }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl px-6 pb-6 leading-snug sm:px-8">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
