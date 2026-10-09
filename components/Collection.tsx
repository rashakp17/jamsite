"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { ProductCard } from "./ProductCard";
import { RevealText } from "./ui/motion";

/** On desktop the cards travel sideways while the section is pinned; on touch it is a swipeable row. */
export function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  return (
    <section
      ref={sectionRef}
      id="shop"
      aria-labelledby="collection-heading"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16" : "py-20 sm:py-28"}>
        <div className="container-page flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="tag bg-ink text-cream">4 flavours · 240g jars</span>
            <RevealText
              id="collection-heading"
              text="Pick your jar."
              accentWords={[2]}
              className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
            />
          </div>
          <div className="hidden h-2 w-44 overflow-hidden rounded-full bg-ink/10 lg:block">
            <motion.div style={{ scaleX: smooth }} className="h-full origin-left rounded-full bg-jam" />
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={`mt-10 flex items-stretch gap-5 lg:mt-12 lg:gap-7 ${
            pinned ? "w-max px-12" : "no-scrollbar snap-x snap-mandatory overflow-x-auto px-5 pb-6 pt-2 sm:px-8"
          }`}
        >
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 68vw"
              className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[min(20vw,calc(50svh*0.72))]"
            />
          ))}

          <Link
            href="/products"
            data-cursor="hover"
            className="group grid w-[60vw] shrink-0 snap-start place-items-center sm:w-[36vw] lg:w-[18vw]"
          >
            <span className="grid aspect-square w-[85%] place-items-center rounded-full bg-jam text-center text-cream transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-105 group-hover:-rotate-6">
              <span>
                <span className="block font-display text-3xl font-extrabold leading-[0.9] tracking-[-0.04em] xl:text-4xl">
                  Shop
                  <br />
                  them all
                </span>
                <ArrowRight className="mx-auto mt-4 h-7 w-7 transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
