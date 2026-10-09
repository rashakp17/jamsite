"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { footerNav, socials } from "@/lib/navigation";
import { products } from "@/lib/products";
import { scrollTo } from "@/lib/smoothScroll";
import { Sticker } from "./ui/Sticker";

const wordmark = "berry&bloom".split("");

export function Footer() {
  return (
    <footer className="px-3 pb-3 pt-6 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink text-cream sm:rounded-[3rem]">
        <div className="container-page pb-8 pt-14 sm:pt-20">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-display text-3xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                Real fruit. Slow cooked.
                <br />
                <span className="accent text-pink">Seriously good.</span>
              </p>
              <a href="mailto:hello@berryandbloom.in" className="group mt-8 inline-flex items-center gap-2 text-lg font-semibold">
                <span className="link-line">hello@berryandbloom.in</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
              <div>
                <h2 className="text-sm font-bold text-butter">Explore</h2>
                <ul className="mt-4 space-y-2.5">
                  {footerNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-line text-cream/80 transition-colors hover:text-cream">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-bold text-butter">The jars</h2>
                <ul className="mt-4 space-y-2.5">
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="group inline-flex items-center gap-2 text-cream/80 hover:text-cream">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.palette.bold }} aria-hidden />
                        <span className="link-line">{p.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h2 className="text-sm font-bold text-butter">Say hi</h2>
                <address className="mt-4 not-italic leading-relaxed text-cream/80">
                  The Jam Kitchen
                  <br />
                  Koregaon Park, Pune
                </address>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border-2 border-cream/20 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-cream hover:bg-cream hover:text-ink"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative mt-16 sm:mt-24">
            <p
              aria-label="Berry & Bloom"
              className="flex select-none justify-center overflow-hidden whitespace-nowrap font-display text-[15vw] font-extrabold leading-[0.85] tracking-[-0.07em] pb-[0.14em]"
            >
              {wordmark.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className={`inline-block ${ch === "&" ? "accent font-normal text-jam" : ""}`}
                  initial={{ y: "100%", rotate: i % 2 ? 8 : -8 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.04 }}
                >
                  {ch}
                </motion.span>
              ))}
            </p>
            <div className="absolute -top-10 right-[4%] hidden w-24 md:block lg:w-28">
              <Sticker text="MADE WITH LOVE IN PUNE • " bg="var(--color-pink)" className="w-full">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-jam" fill="currentColor" aria-hidden>
                  <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z" />
                </svg>
              </Sticker>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-cream/10 pt-6 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Berry &amp; Bloom Preserves. Made in small batches in Pune.</p>
            <p>All prices in INR, inclusive of GST.</p>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group inline-flex items-center gap-2 self-start rounded-full bg-cream/10 px-4 py-2 font-semibold text-cream hover:bg-cream hover:text-ink sm:self-auto"
            >
              Back to top
              <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
