"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, products } from "@/lib/products";
import { easeExpo, easeSoft } from "./ui/motion";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.flavour, p.tagline, ...p.notes, ...p.pairsWith].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AnimatePresence onExitComplete={() => setQuery("")}>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search jams"
          data-lenis-prevent
          className="fixed inset-0 z-[70] overflow-y-auto bg-ink text-cream"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: easeExpo }}
        >
          <div className="container-page pb-16 pt-8">
            <div className="label flex items-center justify-between text-cream/50">
              <span>Search the pantry</span>
              <button type="button" onClick={onClose} className="group text-cream">
                <span className="roll">
                  <span>Close · Esc</span>
                  <span aria-hidden>Close · Esc</span>
                </span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: easeSoft }}
              className="mt-16 border-b border-cream/20 sm:mt-24"
            >
              <label htmlFor="site-search" className="sr-only">
                Search our jams
              </label>
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Strawberry, rose, toast…"
                className="w-full bg-transparent pb-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none tracking-tight outline-none placeholder:text-cream/20"
                autoComplete="off"
              />
            </motion.div>

            <p className="label mt-8 text-cream/50" aria-live="polite">
              {results.length ? `${results.length} ${results.length === 1 ? "jar" : "jars"}` : `Nothing matches “${query}” — try “berry” or “mango”`}
            </p>

            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              <AnimatePresence initial={true} mode="popLayout">
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 + i * 0.05, ease: easeSoft } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="border-b border-cream/10"
                  >
                    <Link href={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-5 py-5">
                      <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded" style={{ backgroundColor: p.palette.bold }}>
                        <Image
                          src={p.cutout}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1.5 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-3xl leading-none transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-2">
                          {p.name}
                        </span>
                        <span className="label mt-2 block truncate text-cream/40">{p.flavour}</span>
                      </span>
                      <span className="font-display text-xl">{formatPrice(p.price)}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-cream/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-cream" />
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
