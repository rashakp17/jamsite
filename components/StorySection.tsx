"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { Sticker } from "./ui/Sticker";
import { Counter, MaskImage, Reveal, RevealText } from "./ui/motion";

const stats = [
  { value: 5, suffix: "", label: "people in the kitchen", bg: "bg-butter" },
  { value: 6, suffix: "", label: "family farms", bg: "bg-pink" },
  { value: 12, suffix: "kg", label: "max per pot", bg: "bg-mango" },
];

export function StorySection({ showLink = true }: { showLink?: boolean }) {
  return (
    <section aria-labelledby="story-heading" className="relative py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <MaskImage
            src="/images/mixed-berries.webp"
            alt="A table heaped with strawberries, blueberries, blackberries and redcurrants"
            sizes="(min-width: 1024px) 45vw, 92vw"
            className="arch aspect-[4/5]"
          />
          <MaskImage
            src="/images/raspberries.webp"
            alt="Close-up of fresh raspberries"
            sizes="(min-width: 1024px) 18vw, 40vw"
            delay={0.4}
            parallax={14}
            className="absolute -bottom-10 right-2 aspect-square w-[42%] rounded-full border-8 border-cream sm:-right-6"
          />
          <div className="absolute -left-3 top-8 w-24 sm:-left-6 sm:w-28">
            <Sticker text="SINCE 2019 • ONE COPPER PAN • " bg="var(--color-jam)" fg="var(--color-cream)" className="w-full shadow-xl">
              <span className="font-display text-xl font-extrabold">2019</span>
            </Sticker>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <span className="tag bg-ink text-cream">Our story</span>
          <RevealText
            id="story-heading"
            text="Made slowly. Enjoyed quickly."
            accentWords={[2, 3]}
            className="mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.95]"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-snug">
              It started in a small Pune kitchen with one copper pan, a crate of Mahabaleshwar strawberries and a family recipe on
              an index card.
            </p>
            <p className="mt-3 leading-snug text-ink-soft">
              We still buy from farmers we know by name, and stop cooking when it tastes right, not when the clock says so.
            </p>
          </Reveal>

          <dl className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08} className={`flex flex-col-reverse rounded-[1.75rem] p-5 ${s.bg}`}>
                <dt className="mt-1 text-sm font-semibold leading-tight">{s.label}</dt>
                <dd className="font-display text-4xl font-extrabold leading-none tracking-[-0.05em]">
                  <Counter to={s.value} />
                  <span className="text-2xl">{s.suffix}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          {showLink && (
            <Reveal delay={0.1} className="mt-10">
              <ButtonLink href="/about" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                Read our story
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
