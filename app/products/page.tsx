import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { BreakfastBox } from "@/components/BreakfastBox";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/ui/motion";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Jams",
  description: "Four small-batch fruit jams, each slow-cooked by hand. Strawberry, raspberry rose, Alphonso mango and mixed berry.",
};

const promises = [
  { title: "Free shipping over ₹999", text: "Packed in recycled paper and delivered anywhere in India in 3–5 days." },
  { title: "Twelve months on the shelf", text: "Once opened, keep it in the fridge and finish within four weeks. Most people manage one." },
  { title: "Gift-ready, always", text: "Every order ships with a handwritten card. Just tell us what to write." },
];

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${products.length} jars · 240g each`}
        tone="butter"
        title="Jams worth getting up for."
        accentWords={[3, 4]}
        intro="Every jar is cooked by hand in batches small enough to stir properly, and the batch number is written on the lid."
      />

      <section aria-label="All jams" className="py-16 sm:py-24">
        <div className="container-page">
          <ProductGrid items={products} />
        </div>
      </section>

      <BreakfastBox />

      <section aria-label="Shipping and care" className="py-16 sm:py-24">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.1}
              className={`rounded-[1.75rem] p-7 sm:p-8 ${["bg-pink", "bg-mango", "bg-cream-deep"][i]}`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-xl font-extrabold text-cream">{i + 1}</span>
              <h2 className="mt-5 text-2xl leading-none sm:text-3xl">{p.title}</h2>
              <p className="mt-3 max-w-xs leading-snug opacity-80">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee />
    </>
  );
}
