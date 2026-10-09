import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="flex min-h-[90svh] flex-col items-center justify-center rounded-[2.5rem] bg-jam px-6 pb-16 pt-32 text-center text-cream sm:rounded-[3rem]">
        <span className="tag bg-cream text-jam">404 · Page not found</span>
        <h1 className="mt-6 text-[clamp(4rem,14vw,12rem)] leading-[0.8] tracking-[-0.06em]">
          Oops<span className="accent font-normal text-butter">!</span>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-snug">Someone ate this page. We looked everywhere, even behind the toaster.</p>
        <ButtonLink href="/" variant="light" className="mt-10" icon={<ArrowRight className="h-4 w-4" />}>
          Back to the jams
        </ButtonLink>
      </div>
    </section>
  );
}
