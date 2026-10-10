"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "./cart/CartContext";

/** Colour-blocked product card: the flavour's own colour, an arched jar photo and a quick-add button. */
export function ProductCard({ product, className = "", sizes }: { product: Product; className?: string; sizes?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const jarRef = useRef<HTMLDivElement>(null);
  const { bold, on } = product.palette;

  const onAdd = () => {
    add(product.slug, 1, jarRef.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: -1.5, y: -8 } }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group relative flex flex-col rounded-[1.75rem] p-4 ${className}`}
      style={{ backgroundColor: bold, color: on }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="tag" style={{ backgroundColor: on, color: bold }}>
          {product.badge ?? product.palette.mood}
        </span>
        <span className="text-sm font-semibold opacity-80">{product.weight}</span>
      </div>

      <Link
        href={`/products/${product.slug}`}
        data-cursor="label"
        data-cursor-label="Taste"
        aria-label={`View ${product.name}`}
        className="relative mx-auto mt-4 block aspect-[4/5] w-full"
      >
        {/* soft disc behind the jar that swells on hover */}
        <motion.span
          aria-hidden
          className="absolute inset-x-[8%] top-[10%] aspect-square rounded-full"
          style={{ backgroundColor: on, opacity: 0.14 }}
          variants={{ rest: { scale: 0.9 }, hover: { scale: 1.05 } }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        />
        <motion.div
          ref={jarRef}
          className="absolute inset-[4%]"
          variants={{ rest: { y: 0, rotate: 0, scale: 1 }, hover: { y: -16, rotate: 5, scale: 1.06 } }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          <Image
            src={product.cutout}
            alt={`${product.name} jam jar`}
            fill
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"}
            className="object-contain drop-shadow-[0_28px_24px_rgba(43,15,20,0.4)]"
          />
        </motion.div>
        <motion.span
          aria-hidden
          className="absolute bottom-[1%] left-1/2 h-4 w-[55%] -translate-x-1/2 rounded-[50%] bg-ink/30 blur-lg"
          variants={{ rest: { scaleX: 1, opacity: 0.9 }, hover: { scaleX: 0.8, opacity: 0.5 } }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        />
      </Link>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[1.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[1.65rem]">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1.5 font-bold">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${product.name} to bag`}
          className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-110 active:scale-90"
          style={{ backgroundColor: on, color: bold }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={added ? "y" : "n"}
              initial={{ y: 24, rotate: -90 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: -24, rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {added ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <Plus className="h-5 w-5" strokeWidth={2.6} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </motion.article>
  );
}
