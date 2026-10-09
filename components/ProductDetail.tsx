"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowLeft, Check, Leaf, Minus, Plus, Truck, Gift } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "./cart/CartContext";
import { useIntroReady } from "./IntroContext";
import { Sticker, Stars } from "./ui/Sticker";
import { RevealText, easeExpo, easeSoft } from "./ui/motion";

const secondaryImages: Record<string, { src: string; alt: string }> = {
  "strawberry-bliss": { src: "/images/hero-jam-toast.jpg", alt: "Strawberry jam spread on toasted sourdough" },
  "raspberry-rose": { src: "/images/raspberries.webp", alt: "Freshly harvested ripe raspberries" },
  "mango-sunshine": { src: "/images/berry-flatlay.webp", alt: "Seasonal fruit and botanicals laid out on a table" },
  "mixed-berry": { src: "/images/mixed-berries.webp", alt: "Ripe strawberries, blueberries and raspberries" },
};

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `pd-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className="border-b-2 border-current/15">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 text-left font-display text-lg font-bold tracking-[-0.02em]"
        >
          {title}
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeSoft }}
            className="overflow-hidden"
          >
            <div className="pb-6 leading-relaxed opacity-85">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const ready = useIntroReady();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<"jar" | "life">("jar");
  const { bold, on } = product.palette;
  const secondary = secondaryImages[product.slug] ?? { src: "/images/berry-flatlay.webp", alt: "Fresh fruit" };

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Flat 2D sway only: 3D tilt plus drop-shadow gets clipped by some GPUs in Chrome.
  const rot = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 16 });
  const shiftY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 16 });

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, delay, ease: easeSoft },
  });

  const onAdd = () => {
    add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section aria-labelledby="product-heading" className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="rounded-[2.5rem] pb-16 pt-28 sm:rounded-[4rem] sm:pb-24 sm:pt-32" style={{ backgroundColor: bold, color: on }}>
        <div className="container-page">
          <motion.div {...fadeUp(0.2)}>
            <Link href="/products" className="group inline-flex items-center gap-2 font-semibold">
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
              <span className="link-line">All jams</span>
            </Link>
          </motion.div>

          <div className="mt-8 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* image stage */}
            <div className="lg:sticky lg:top-28">
              <div
                className="relative mx-auto max-w-[27rem]"
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse") return;
                  const r = e.currentTarget.getBoundingClientRect();
                  px.set((e.clientX - r.left) / r.width - 0.5);
                  py.set((e.clientY - r.top) / r.height - 0.5);
                }}
                onPointerLeave={() => {
                  px.set(0);
                  py.set(0);
                }}
              >
                <motion.div
                  initial={{ y: 120, opacity: 0 }}
                  animate={ready ? { y: 0, opacity: 1 } : undefined}
                  transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
                >
                  <motion.div style={{ rotate: rot, y: shiftY }} className="relative aspect-[4/5]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {view === "jar" ? (
                        <motion.div
                          key="jar"
                          className="absolute inset-0"
                          initial={{ y: "-40%", rotate: -18, scale: 0.7, opacity: 0 }}
                          animate={{ y: "0%", rotate: 0, scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.3 } }}
                          transition={{ type: "spring", stiffness: 110, damping: 13 }}
                        >
                          <div aria-hidden className="absolute inset-x-[6%] top-[8%] aspect-square rounded-full bg-current opacity-[0.1]" />
                          {/* gentle idle bob */}
                          <motion.div
                            className="absolute inset-[3%]"
                            animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
                            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                          >
                            <Image
                              src={product.cutout}
                              alt={`A jar of ${product.name}`}
                              fill
                              priority
                              sizes="(min-width: 1024px) 45vw, 92vw"
                              className="object-contain drop-shadow-[0_45px_40px_rgba(43,15,20,0.45)]"
                            />
                          </motion.div>
                          <motion.div
                            aria-hidden
                            className="absolute -bottom-2 left-1/2 h-6 w-[55%] -translate-x-1/2 rounded-[50%] bg-ink/35 blur-xl"
                            animate={{ scaleX: [1, 0.85, 1], opacity: [0.9, 0.6, 0.9] }}
                            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="life"
                          className="arch absolute inset-0 overflow-hidden shadow-[0_50px_80px_-30px_rgba(43,15,20,0.55)]"
                          initial={{ clipPath: "circle(0% at 50% 100%)" }}
                          animate={{ clipPath: "circle(150% at 50% 100%)" }}
                          exit={{ opacity: 0, transition: { duration: 0.3 } }}
                          transition={{ duration: 0.9, ease: easeExpo }}
                        >
                          <Image src={secondary.src} alt={secondary.alt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, rotate: -40 }}
                  animate={ready ? { scale: 1, rotate: 0 } : undefined}
                  transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.9 }}
                  className="absolute -left-3 top-[12%] w-24 sm:-left-6 sm:w-28"
                >
                  <Sticker text={`${product.palette.mood.toUpperCase()} • SMALL BATCH • `} bg={on} fg={bold} className="w-full shadow-xl">
                    <span className="font-display text-lg font-extrabold leading-none">{product.weight}</span>
                  </Sticker>
                </motion.div>

                <div className="mt-5 flex justify-center gap-3">
                  {(["jar", "life"] as const).map((v) => {
                    const src = v === "jar" ? product.cutout : secondary.src;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setView(v)}
                        aria-label={v === "jar" ? "Show the jar" : "Show it served"}
                        aria-pressed={view === v}
                        className={`relative h-14 w-16 overflow-hidden rounded-full border-[3px] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-110 ${
                          view === v ? "scale-110" : "opacity-70"
                        }`}
                        style={{ borderColor: view === v ? on : "transparent", backgroundColor: v === "jar" ? on : undefined }}
                      >
                        <Image src={src} alt="" fill sizes="64px" className={v === "jar" ? "object-contain p-1.5" : "object-cover"} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* details */}
            <div>
              <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center gap-2">
                {product.badge && (
                  <span className="tag" style={{ backgroundColor: on, color: bold }}>
                    {product.badge}
                  </span>
                )}
                <span className="tag border-2 border-current/30">{product.flavour}</span>
                <span className="ml-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <Stars className="h-4 w-4" /> 4.9
                </span>
              </motion.div>
              <RevealText
                as="h1"
                id="product-heading"
                play={ready}
                delay={0.35}
                text={product.name}
                className="mt-5 text-[clamp(2.6rem,4.6vw,4.5rem)] leading-[0.92]"
              />
              <motion.p {...fadeUp(0.55)} className="accent mt-3 text-2xl sm:text-3xl">
                {product.tagline}
              </motion.p>

              <motion.div {...fadeUp(0.65)}>
                <p className="mt-5 max-w-lg leading-snug opacity-90">{product.description}</p>

                <div className="mt-8 flex items-center gap-3">
                  <span className="font-display text-4xl font-extrabold tracking-[-0.05em]">{formatPrice(product.price)}</span>
                  <span className="text-sm font-semibold opacity-75">incl. GST</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="flex h-14 items-center rounded-full border-2 border-current/30">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-14 w-14 place-items-center"
                    >
                      <Minus className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <output aria-live="polite" className="w-6 text-center text-lg font-bold tabular-nums">
                      {qty}
                    </output>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => Math.min(12, q + 1))}
                      className="grid h-14 w-14 place-items-center"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                  <motion.button
                    type="button"
                    onClick={onAdd}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full px-8 text-base font-bold shadow-[0_20px_40px_-20px_rgba(43,15,20,0.6)] sm:flex-none sm:min-w-[16rem]"
                    style={{ backgroundColor: on, color: bold }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={added ? "y" : "n"}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        {added ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <Plus className="h-5 w-5" strokeWidth={2.6} />}
                        {added ? "Added to bag!" : `Add to bag · ${formatPrice(product.price * qty)}`}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                <ul className="mt-8 grid gap-3 text-sm font-semibold sm:grid-cols-3">
                  {[
                    { icon: Truck, text: "Free shipping over ₹999" },
                    { icon: Leaf, text: "No preservatives" },
                    { icon: Gift, text: "Handwritten card" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 rounded-2xl bg-current/10 px-4 py-3">
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={2.4} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t-2 border-current/15">
                  <Disclosure title="The story" defaultOpen>
                    <p>{product.story}</p>
                  </Disclosure>
                  <Disclosure title="Tastes & pairings">
                    <p>
                      {product.notes.join(", ")}. Lovely with {product.pairsWith.join(", ").toLowerCase()}.
                    </p>
                  </Disclosure>
                  <Disclosure title="Ingredients">
                    <p>{product.ingredients} Vegan. No pectin, no artificial colours.</p>
                  </Disclosure>
                  <Disclosure title="Shipping & care">
                    <p>
                      Ships within two working days. Unopened, twelve months in a cool cupboard; once open, keep it in the fridge and
                      finish within four weeks.
                    </p>
                  </Disclosure>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
