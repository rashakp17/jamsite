import Link from "next/link";

export function Logo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "cream" }) {
  return (
    <Link
      href="/"
      aria-label="Berry & Bloom home"
      className={`group inline-flex items-center gap-2 whitespace-nowrap font-display text-[1.15rem] font-extrabold sm:text-[1.3rem] leading-none tracking-[-0.05em] ${
        tone === "cream" ? "text-cream" : "text-ink"
      } ${className}`}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110" aria-hidden>
        <path d="M16 7c-6.5 0-11 4.6-11 10.4C5 24 10 29 16 29s11-5 11-11.6C27 11.6 22.5 7 16 7z" fill="#e2323f" />
        <path d="M16 8c-.6-3.2 1.2-5.6 4.6-6-.2 3.2-2 5.4-4.6 6z" fill="#2f7d4f" />
        <circle cx="11.5" cy="15" r="1.1" fill="#fff4e6" />
        <circle cx="16" cy="19" r="1.1" fill="#fff4e6" />
        <circle cx="20.5" cy="15" r="1.1" fill="#fff4e6" />
        <circle cx="13" cy="23" r="1.1" fill="#fff4e6" />
        <circle cx="19" cy="23" r="1.1" fill="#fff4e6" />
      </svg>
      <span>
        berry<span className="accent text-jam">&amp;</span>bloom
      </span>
    </Link>
  );
}
