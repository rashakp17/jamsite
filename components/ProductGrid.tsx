"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { easeSoft } from "./ui/motion";

export function ProductGrid({ items, className = "" }: { items: Product[]; className?: string }) {
  return (
    <motion.ul
      className={`grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      {items.map((p) => (
        <motion.li
          key={p.slug}
          variants={{
            hidden: { opacity: 0, y: 60, clipPath: "inset(12% 0% 0% 0%)" },
            show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: easeSoft } },
          }}
        >
          <ProductCard product={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
