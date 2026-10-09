import { PageHeader } from "./PageHeader";
import { Reveal } from "./ui/motion";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader eyebrow={`Last updated ${updated}`} title={title} tone="cream" />
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <ol className="border-t border-ink/15">
            {sections.map((s, i) => (
              <li key={s.heading} className="border-b border-ink/15">
                <Reveal y={20} className="grid gap-4 py-10 lg:grid-cols-12">
                  <span className="label text-ink-soft lg:col-span-2">0{i + 1}</span>
                  <h2 className="text-3xl leading-none tracking-tight sm:text-4xl lg:col-span-4">{s.heading}</h2>
                  <div className="max-w-xl space-y-3 lg:col-span-6">
                    {s.body.map((p, j) => (
                      <p key={j} className="leading-relaxed text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
