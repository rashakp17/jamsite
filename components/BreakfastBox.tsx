"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { formatPrice, products } from "@/lib/products";
import { useCart } from "./cart/CartContext";
import { Button } from "./ui/Button";
import { Sticker } from "./ui/Sticker";
import { MaskImage, Magnetic, Reveal, RevealText } from "./ui/motion";

const fullPrice = products.reduce((n, p) => n + p.price, 0);
const includes = ["All four jams", "Wooden spreader", "Recipe card", "Handwritten note"];

export function BreakfastBox() {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const addAll = () => {
    products.forEach((p) => add(p.slug));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section aria-labelledby="box-heading" className="px-3 py-6 sm:px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-plum py-14 text-cream sm:rounded-[3rem] sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <MaskImage
              src="/images/breakfast-box.jpg"
              alt="The Breakfast Box gift set with four jars and a wooden spreader"
              sizes="(min-width: 1024px) 45vw, 92vw"
              from="center"
              className="aspect-square rounded-[2rem] sm:aspect-[4/3] lg:aspect-square"
            />
            <div className="absolute -bottom-6 -right-2 w-24 sm:w-32 lg:-right-6">
              <Sticker text="THE PERFECT GIFT • THE PERFECT GIFT • " bg="var(--color-butter)" className="w-full shadow-2xl">
                <span className="font-display text-xl font-extrabold leading-none">4 jars</span>
              </Sticker>
            </div>
          </div>

          <div>
            <span className="tag bg-pink text-ink">The Breakfast Box</span>
            <RevealText
              id="box-heading"
              text="All four. One very good morning."
              accentWords={[4, 5]}
              accentClassName="accent text-pink"
              className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 font-medium">
                    <Check className="h-4 w-4 text-butter" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm font-semibold opacity-70">Whole box</p>
                  <p className="font-display text-5xl font-extrabold leading-none tracking-[-0.05em]">{formatPrice(fullPrice)}</p>
                </div>
                <Magnetic strength={0.2}>
                  <Button
                    variant="light"
                    onClick={addAll}
                    className="h-14 px-8"
                    aria-label="Add all four jars to bag"
                    icon={added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  >
                    {added ? "Box added!" : "Add the box"}
                  </Button>
                </Magnetic>
              </div>
              <p className="mt-4 text-sm opacity-70">Ships free anywhere in India, in a kraft gift box.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
