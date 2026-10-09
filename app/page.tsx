import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Collection } from "@/components/Collection";
import { ToastMoment } from "@/components/ToastMoment";
import { Process } from "@/components/Process";
import { Ingredients } from "@/components/Ingredients";
import { BreakfastBox } from "@/components/BreakfastBox";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Collection />
      <ToastMoment />
      <Process />
      <Ingredients />
      <BreakfastBox />
      <Testimonials />
      <Newsletter />
    </>
  );
}
