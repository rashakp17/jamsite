"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";
import { isActive, mainNav, socials } from "@/lib/navigation";
import { easeExpo, easeSoft } from "./ui/motion";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

const hoverColors = ["hover:text-butter", "hover:text-pink", "hover:text-butter", "hover:text-pink", "hover:text-butter"];

export function MobileMenu({
  open,
  onClose,
  onSearch,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  pathname: string;
}) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ clipPath: "circle(0% at 92% 6%)" }}
          animate={{ clipPath: "circle(150% at 92% 6%)" }}
          exit={{ clipPath: "circle(0% at 92% 6%)" }}
          transition={{ duration: 0.8, ease: easeExpo }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-jam pt-28 text-cream lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page flex-1">
            <ul className="space-y-1">
              {mainNav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%", rotate: 6 }}
                    animate={{ y: "0%", rotate: 0, transition: { duration: 0.8, delay: 0.2 + i * 0.06, ease: easeSoft } }}
                    exit={{ y: "110%", transition: { duration: 0.3 } }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`block py-1 font-display text-[2.6rem] font-extrabold leading-[1] tracking-[-0.05em] transition-colors aria-[current=page]:text-butter sm:text-6xl ${hoverColors[i]}`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.button
              type="button"
              onClick={() => {
                onClose();
                onSearch();
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
              exit={{ opacity: 0 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-semibold text-jam"
            >
              <Search className="h-4 w-4" /> Search the pantry
            </motion.button>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: easeSoft } }}
            exit={{ opacity: 0 }}
            className="container-page flex flex-wrap items-end justify-between gap-4 pb-8 pt-10"
          >
            <a href="mailto:hello@berryandbloom.in" className="font-semibold">
              hello@berryandbloom.in
            </a>
            <ul className="flex gap-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold opacity-85 hover:opacity-100">
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
