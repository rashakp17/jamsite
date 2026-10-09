"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Search, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "./cart/CartContext";
import { useIntroReady } from "./IntroContext";
import { isActive, mainNav } from "@/lib/navigation";
import { easeSoft } from "./ui/motion";

export function Navbar() {
  const pathname = usePathname();
  const ready = useIntroReady();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, open: openCart, addedTick } = useCart();

  // Tuck away while reading downwards, return as soon as the reader scrolls up.
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Smooth scrolling eases out in tiny steps, so only react to a clear change of direction.
    if (v <= 160 || v < prev - 2) setHidden(false);
    else if (v > prev + 2) setHidden(true);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI on navigation
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  // Bring the bar back whenever something is added, so the bag count is seen to change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reveal on add
    if (addedTick) setHidden(false);
  }, [addedTick]);

  return (
    <>
      <motion.header
        initial={{ y: "-150%" }}
        animate={{ y: ready && (!hidden || menuOpen) ? "0%" : "-150%" }}
        transition={{ duration: 0.7, ease: easeSoft }}
        className="fixed inset-x-0 top-3 z-50 sm:top-4"
      >
        <nav
          aria-label="Main"
          className="container-page"
        >
          <div className="flex h-14 items-center justify-between gap-3 rounded-full bg-cream/90 pl-4 pr-2 text-ink sm:pl-6 shadow-[0_12px_40px_-16px_rgba(43,15,20,0.35)] ring-1 ring-ink/5 backdrop-blur-xl">
            <Logo />

            <ul className="hidden items-center gap-1 lg:flex">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative block rounded-full px-3.5 py-2 text-[0.85rem] font-semibold transition-colors ${
                        active ? "text-cream" : "hover:bg-ink/5"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="roll relative">
                        <span>{item.label}</span>
                        <span aria-hidden>{item.label}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:grid"
                onClick={() => setSearchOpen(true)}
                aria-label="Search jams"
              >
                <Search className="h-[19px] w-[19px]" strokeWidth={2.2} />
              </button>

              <motion.button
                key={addedTick}
                type="button"
                initial={false}
                animate={addedTick ? { scale: [1, 1.12, 1], rotate: [0, -4, 3, 0] } : undefined}
                transition={{ duration: 0.55, ease: easeSoft }}
                className="flex h-10 items-center gap-2 rounded-full bg-jam pl-3.5 pr-1 font-semibold text-cream transition-colors hover:bg-jam-deep"
                aria-label={`Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
                onClick={openCart}
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
                <span className="hidden text-[0.85rem] sm:inline">Bag</span>
                <span className="grid h-8 min-w-8 place-items-center overflow-hidden rounded-full bg-cream px-2 text-sm tabular-nums text-jam">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={count}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeSoft }}
                    >
                      {count}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.button>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="relative block h-3 w-5">
                  <motion.span
                    className="absolute left-0 top-0 h-0.5 w-full rounded bg-current"
                    animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.4, ease: easeSoft }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded bg-current"
                    animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.4, ease: easeSoft }}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
