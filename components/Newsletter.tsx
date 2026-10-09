"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { RevealText, easeSoft } from "./ui/motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(EMAIL_RE.test(email.trim()) ? "done" : "error");
  };

  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className="scroll-mt-24 px-3 py-6 sm:px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-jam px-6 py-14 text-center text-cream sm:rounded-[3rem] sm:py-20">
        <span className="tag bg-cream text-jam">10% off your first order</span>
        <RevealText
          id="newsletter-heading"
          text="Get a little sweeter."
          accentWords={[3]}
          accentClassName="accent text-butter"
          className="mx-auto mt-5 max-w-4xl text-[clamp(2.4rem,5vw,5rem)] leading-[0.92]"
        />
        <p className="mx-auto mt-4 max-w-md opacity-90">New flavours, recipes and first dibs on seasonal batches.</p>

        <div className="mx-auto mt-8 min-h-[5rem] max-w-lg">
          <AnimatePresence mode="wait" initial={false}>
            {status === "done" ? (
              <motion.p
                key="done"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                role="status"
                className="inline-block rounded-full bg-butter px-6 py-3 font-display text-xl font-extrabold text-ink"
              >
                You&rsquo;re in! Check your inbox.
              </motion.p>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -10 }} transition={{ ease: easeSoft }} onSubmit={onSubmit} noValidate>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex items-center gap-2 rounded-full bg-cream p-2 shadow-[0_20px_40px_-20px_rgba(43,15,20,0.6)]">
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    className="h-11 min-w-0 flex-1 bg-transparent px-5 text-ink outline-none placeholder:text-ink/40"
                  />
                  <button
                    type="submit"
                    className="group flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-cream transition-colors duration-300 hover:bg-plum"
                  >
                    <span className="hidden sm:inline">Join</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
                {status === "error" && (
                  <p id="newsletter-error" className="mt-3 font-medium text-butter" role="alert">
                    That email doesn&rsquo;t look quite right. Mind checking it?
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
