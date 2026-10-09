import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StorySection } from "@/components/StorySection";
import { Process } from "@/components/Process";
import { Marquee } from "@/components/Marquee";
import { Newsletter } from "@/components/Newsletter";
import { MaskImage, Reveal, RevealText } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How a Pune kitchen, one copper pan and a crate of Mahabaleshwar strawberries became Berry & Bloom.",
};

const values = [
  {
    title: "Farmers first",
    text: "We pay our six partner farms before the fruit arrives, and above the market rate. Good jam starts with farmers who can afford to wait for ripe fruit.",
  },
  {
    title: "Glass, not plastic",
    text: "Every jar is glass and every lid is metal, and our packing paper is recycled. Send back five empty jars and the sixth is on us.",
  },
  {
    title: "Slow on purpose",
    text: "We could make jam faster. We don't, because the slow way tastes better and we'd rather make less of it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story · since 2019"
        tone="pink"
        title="A small kitchen with a soft spot for fruit."
        accentWords={[5, 6, 7]}
        intro="Berry & Bloom is a team of five, a handful of copper pans and a lot of fruit. This is how it started, and how we still make every jar."
      />

      <section aria-label="Berry flat lay" className="px-3 pt-6 sm:px-4">
        <div>
          <MaskImage
            src="/images/berry-flatlay.webp"
            alt="A flat lay of strawberries, blackberries, rhubarb and blood orange on a white table"
            sizes="(min-width: 1536px) 1440px, 100vw"
            priority
            from="center"
            parallax={12}
            className="aspect-[4/5] rounded-[2.5rem] sm:aspect-[16/9] sm:rounded-[4rem] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <StorySection showLink={false} />
      <Marquee />
      <Process />

      <section aria-labelledby="values-heading" className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <span className="tag bg-ink text-cream">What we care about</span>
          </Reveal>
          <RevealText
            id="values-heading"
            text="Three things we won't compromise on."
            accentWords={[3, 4]}
            className="mt-4 max-w-5xl text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.92] tracking-[-0.03em]"
          />
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.08} y={40} className={`h-full rounded-[2rem] p-8 sm:p-10 ${["bg-butter", "bg-jam text-cream", "bg-plum text-cream"][i]}`}>
                  <span className="font-display text-5xl font-extrabold leading-none tracking-[-0.06em] opacity-90">0{i + 1}</span>
                  <h3 className="mt-8 text-3xl leading-none">{v.title}</h3>
                  <p className="mt-3 leading-snug opacity-85">{v.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
