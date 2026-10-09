import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order, wholesale or gifting? Write to the Berry & Bloom kitchen.",
};

const details = [
  { label: "Email", value: "hello@berryandbloom.in", href: "mailto:hello@berryandbloom.in" },
  { label: "Kitchen", value: "Koregaon Park, Pune 411001" },
  { label: "Hours", value: "Mon–Sat, 9am–6pm IST" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Replies within a working day"
        tone="mango"
        title="Say hello. We read every note."
        accentWords={[1]}
        intro="An order question, a wholesale enquiry or a gift that needs to arrive on a certain day: someone from the kitchen will reply."
      />

      <section aria-label="Contact form and details" className="py-16 sm:py-24">
        <div className="container-page grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ContactForm />
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <ul className="space-y-3">
              {details.map(({ label, value, href }) => (
                <li key={label} className="rounded-[1.75rem] bg-cream-deep px-6 py-5">
                  <p className="label text-ink-soft">{label}</p>
                  {href ? (
                    <a href={href} className="group mt-1 inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-[-0.03em]">
                      <span className="link-line">{value}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <p className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em]">{value}</p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Faq />
    </>
  );
}
