"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "jam" | "outline" | "light" | "ghost-light";

const variants: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  solid: { base: "bg-ink text-cream", fill: "bg-jam", hoverText: "" },
  jam: { base: "bg-jam text-cream", fill: "bg-ink", hoverText: "" },
  outline: { base: "border-2 border-ink text-ink", fill: "bg-ink", hoverText: "group-hover:text-cream" },
  light: { base: "bg-cream text-ink", fill: "bg-ink", hoverText: "group-hover:text-cream" },
  "ghost-light": { base: "border-2 border-cream/60 text-cream", fill: "bg-cream", hoverText: "group-hover:text-ink" },
};

const base =
  "group relative isolate inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[0.875rem] font-semibold transition-[color,transform] duration-500 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Small trailing element (usually an icon) that sits outside the rolling label */
  icon?: ReactNode;
}

/** Label that rolls to a copy of itself, over a fill that rises from below. */
function Inner({ variant, children, icon }: { variant: Variant; children: ReactNode; icon?: ReactNode }) {
  const v = variants[variant];
  return (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-y-0 ${v.fill}`}
      />
      <span className={`roll ${v.hoverText} transition-colors duration-500`}>
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      {icon && (
        <span className={`relative transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-1 ${v.hoverText}`}>
          {icon}
        </span>
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  className = "",
  children,
  icon,
  ...rest
}: CommonProps & { href: string; onClick?: () => void; "aria-label"?: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant].base} ${className}`} {...rest}>
      <Inner variant={variant} icon={icon}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  variant = "solid",
  className = "",
  children,
  icon,
  type = "button",
  ...rest
}: CommonProps & {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button type={type} className={`${base} ${variants[variant].base} ${className}`} {...rest}>
      <Inner variant={variant} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}
