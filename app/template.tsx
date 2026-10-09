"use client";

import { motion } from "motion/react";
import { easeExpo, easeSoft } from "@/components/ui/motion";

/** Re-mounts on every navigation: a curtain lifts off the new page as its content settles. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[85] origin-top bg-jam"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: easeExpo }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: easeSoft }}
      >
        {children}
      </motion.div>
    </>
  );
}
