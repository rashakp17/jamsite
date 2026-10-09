import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { FlavourIndex } from "@/components/FlavourIndex";
import { Marquee } from "@/components/Marquee";
import { RevealText } from "@/components/ui/motion";
import { getProduct, products } from "@/lib/products";

export const instant = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <ProductDetail product={product} />
      <Marquee single />
      <section aria-labelledby="more-heading" className="py-20 sm:py-28">
        <div className="container-page">
          <FlavourIndex
            items={others}
            heading={
              <>
                <span className="tag bg-ink text-cream">Keep tasting</span>
                <RevealText
                  id="more-heading"
                  text="You might also love"
                  accentWords={[3]}
                  className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.92] tracking-[-0.03em]"
                />
              </>
            }
          />
        </div>
      </section>
    </>
  );
}
