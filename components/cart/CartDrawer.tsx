"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/products";
import { Button, ButtonLink } from "../ui/Button";
import { easeExpo, easeSoft } from "../ui/motion";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const FREE_SHIPPING = 999;

export function CartDrawer() {
  const { items, count, subtotal, isOpen, close, setQty, remove } = useCart();
  const [note, setNote] = useState(false);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const remaining = Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = Math.min(subtotal / FREE_SHIPPING, 1);

  return (
    <AnimatePresence onExitComplete={() => setNote(false)}>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <motion.button
            type="button"
            aria-label="Close bag"
            onClick={close}
            className="absolute inset-0 h-full w-full bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.8, ease: easeExpo }}
            className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-cream"
          >
            <header className="flex items-end justify-between border-b border-ink/15 px-6 pb-5 pt-7 sm:px-8">
              <h2 className="font-display text-4xl leading-none tracking-tight">
                Bag <sup className="label align-super text-ink-soft">({count})</sup>
              </h2>
              <button type="button" onClick={close} className="group text-[0.82rem] font-medium">
                <span className="roll">
                  <span>Close</span>
                  <span aria-hidden>Close</span>
                </span>
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col justify-end gap-6 px-6 pb-10 sm:px-8">
                <p className="font-display text-5xl leading-[0.95] tracking-tight">
                  Your bag is feeling <em className="text-jam">a little empty.</em>
                </p>
                <p className="text-ink-soft">Four jars are waiting, and they&rsquo;re all very good.</p>
                <ButtonLink href="/products" onClick={close} className="self-start" icon={<ArrowRight className="h-4 w-4" />}>
                  Explore the jams
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5 sm:px-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">
                      {remaining > 0 ? (
                        <>
                          <span className="text-ink">{formatPrice(remaining)}</span> away from free shipping
                        </>
                      ) : (
                        "Free shipping unlocked"
                      )}
                    </span>
                    <span className="label text-ink-soft">{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="mt-3 h-px bg-ink/15">
                    <motion.div
                      className="h-full origin-left bg-jam"
                      initial={false}
                      animate={{ scaleX: progress }}
                      transition={{ duration: 0.8, ease: easeSoft }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, qty }, i) => (
                      <motion.li
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.25 + i * 0.05, ease: easeSoft } }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.35 } }}
                        className="flex gap-5 border-b border-ink/15 py-5"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={close}
                          className="relative h-28 w-24 shrink-0 overflow-hidden rounded"
                          style={{ backgroundColor: product.palette.bold }}
                          aria-label={product.name}
                        >
                          <Image src={product.cutout} alt="" fill sizes="96px" className="object-contain p-2" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-display text-2xl leading-none">{product.name}</p>
                              <p className="label mt-2 text-ink-soft">{product.weight}</p>
                            </div>
                            <p className="font-display text-xl leading-none">{formatPrice(product.price * qty)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-ink/20">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.name} quantity`}
                                onClick={() => setQty(product.slug, qty - 1)}
                                className="grid h-9 w-9 place-items-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-sm tabular-nums" aria-live="polite">
                                {qty}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                onClick={() => setQty(product.slug, qty + 1)}
                                className="grid h-9 w-9 place-items-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(product.slug)}
                              className="link-line text-xs text-ink-soft hover:text-ink"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-ink/15 px-6 py-6 sm:px-8">
                  <div className="flex items-baseline justify-between">
                    <span className="label text-ink-soft">Subtotal</span>
                    <span className="font-display text-4xl leading-none">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">Taxes included. Shipping calculated at checkout.</p>
                  <Button className="mt-5 h-14 w-full" onClick={() => setNote(true)} icon={<ArrowRight className="h-4 w-4" />}>
                    Checkout
                  </Button>
                  <AnimatePresence>
                    {note && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-center text-sm text-ink-soft"
                        role="status"
                      >
                        Checkout opens with our first harvest drop. We&rsquo;ll keep your bag safe until then.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
