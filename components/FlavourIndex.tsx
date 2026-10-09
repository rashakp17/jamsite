"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, products, type Product } from "@/lib/products";
import { Reveal, easeSoft } from "./ui/motion";

/**
 * A big typographic list of jars. Hovering a row floods it with that flavour's colour and
 * floats the jar photo beside the cursor; on touch each row shows a thumbnail instead.
 */
export function FlavourIndex({ items = products, heading }: { items?: Product[]; heading?: React.ReactNode }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    x.set(px);
    y.set(py);
    // First entry: place the preview under the cursor rather than gliding in from the corner.
    if (hovered === null) {
      sx.jump(px);
      sy.jump(py);
    }
  };

  return (
    <div>
      {heading}
      <div className="relative mt-10" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        <ul className="space-y-3">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Reveal y={30} delay={i * 0.06}>
                <Link
                  href={`/products/${p.slug}`}
                  onPointerEnter={() => setHovered(i)}
                  className="group relative isolate grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden rounded-[2rem] border-2 border-ink/10 px-4 py-3.5 transition-colors duration-500 sm:gap-6 sm:px-7 sm:py-5"
                  style={{ color: hovered === i ? p.palette.on : undefined }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 translate-y-full rounded-[inherit] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-y-0"
                    style={{ backgroundColor: p.palette.bold }}
                  />
                  <span className="relative h-16 w-16 overflow-hidden rounded-full md:hidden" style={{ backgroundColor: p.palette.bold }}>
                    <Image src={p.cutout} alt="" fill sizes="64px" className="object-contain p-1.5" />
                  </span>
                  <span className="hidden h-4 w-4 rounded-full md:block" style={{ backgroundColor: p.palette.bold }} aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-display text-3xl font-extrabold leading-none tracking-[-0.05em] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-3 sm:text-4xl lg:text-5xl">
                      {p.name}
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold opacity-70 md:hidden">{p.flavour}</span>
                  </span>
                  <span className="flex items-center gap-4 sm:gap-8">
                    <span className="hidden gap-2 lg:flex">
                      {p.notes.map((n) => (
                        <span key={n} className="tag border-2 border-current/25">
                          {n}
                        </span>
                      ))}
                    </span>
                    <span className="hidden font-display text-xl font-extrabold sm:block">{formatPrice(p.price)}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-current transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={2.4} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* floating preview */}
        <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block">
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.4, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                exit={{ opacity: 0, scale: 0.4, rotate: 8 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative -ml-32 -mt-44 h-60 w-48"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={hovered}
                    className="absolute inset-0"
                    initial={{ y: 40, rotate: -12, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: easeSoft }}
                  >
                    <Image src={items[hovered].cutout} alt="" fill sizes="224px" className="object-contain drop-shadow-[0_30px_30px_rgba(43,15,20,0.5)]" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
