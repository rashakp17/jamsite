"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, type Transition } from "motion/react";
import { Check, X } from "lucide-react";
import { formatPrice, getProduct } from "@/lib/products";
import { useCart, type Flight } from "./CartContext";

const FREE_SHIPPING = 999;
const MAX_START = 200; // a jar never starts its flight bigger than this, even from a large photo
const BOX_W = 104;
const BOX_H = 76;
const FLAP_H = 18;
const JAR_DURATION = 1.25;
const JAR_TIMES = [0, 0.18, 0.3, 0.6, 0.84, 1];
const JAR_EASE: Transition["ease"] = ["easeOut", "linear", "easeIn", "easeOut", "easeIn"];
const JAR_SPIN = [0, 8, 24, 200, 360, 360]; // degrees the jar turns on its own axis over the flight

/** Where the bag button rests, even if the navbar is currently tucked away above the screen. */
function bagTarget() {
  const bag = document.getElementById("bag-target");
  const header = document.getElementById("site-header");
  if (!bag) return { x: window.innerWidth - 60, y: 40, headerBottom: 80 };
  const r = bag.getBoundingClientRect();
  let dy = 0;
  let headerBottom = r.bottom + 8;
  if (header) {
    const restingTop = parseFloat(getComputedStyle(header).top) || 0;
    const hr = header.getBoundingClientRect();
    dy = restingTop - hr.top;
    headerBottom = hr.bottom + dy;
  }
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 + dy, headerBottom };
}

/** The shipping box parks just under the navbar, centred below the bag button. */
function boxGeometry() {
  const bag = bagTarget();
  const cx = Math.min(Math.max(bag.x, BOX_W / 2 + 12), window.innerWidth - BOX_W / 2 - 12);
  const top = bag.headerBottom + 54;
  return { cx, top, left: cx - BOX_W / 2, mouthY: top, bag };
}

interface Burst {
  id: number;
  x: number;
  y: number;
  color: string;
}

type Fit = { x: number; y: number; w: number; h: number };

/** Where the jar's round body sits inside the cutout, measured from the photo's alpha channel. */
function measureBody(img: HTMLImageElement, fit: Fit) {
  const sw = 256;
  const sh = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * sw));
  const probe = document.createElement("canvas");
  probe.width = sw;
  probe.height = sh;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  if (!pctx) return null;
  pctx.drawImage(img, 0, 0, sw, sh);
  // widest opaque run across the lower half of the jar = the glass body
  let left = sw;
  let right = -1;
  for (const f of [0.55, 0.65, 0.75]) {
    const row = pctx.getImageData(0, Math.floor(sh * f), sw, 1).data;
    for (let i = 0; i < sw; i++) {
      if (row[i * 4 + 3] > 60) {
        left = Math.min(left, i);
        right = Math.max(right, i);
      }
    }
  }
  if (right <= left) return null;
  const k = fit.w / sw;
  return { cx: fit.x + ((left + right + 1) / 2) * k, r: ((right - left + 1) / 2) * k };
}

/**
 * Paints the cutout as a real cylinder turning on its axis: the outline stays put while the label
 * wraps around the curved glass (back of the jar mirrors the front), and the light stays fixed.
 */
function paintJar(ctx: CanvasRenderingContext2D, img: HTMLImageElement, fit: Fit, body: { cx: number; r: number } | null, deg: number) {
  const { width, height } = ctx.canvas;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, fit.x, fit.y, fit.w, fit.h);
  if (!body || deg === 0) return;

  const a = (deg * Math.PI) / 180;
  const k = img.naturalWidth / fit.w; // source pixels per canvas pixel
  for (let X = Math.floor(body.cx - body.r); X < Math.ceil(body.cx + body.r); X++) {
    const u = Math.min(Math.max((X + 0.5 - body.cx) / body.r, -1), 1);
    let psi = Math.asin(u) + a;
    psi = ((((psi + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    if (psi > Math.PI / 2) psi = Math.PI - psi;
    else if (psi < -Math.PI / 2) psi = -Math.PI - psi;
    const sx = (body.cx + body.r * Math.sin(psi) - fit.x) * k;
    ctx.drawImage(img, sx, 0, Math.max(k, 1), img.naturalHeight, X, fit.y, 1.5, fit.h);
  }

  // keep the true silhouette (lid, shoulders) of the photo
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(img, fit.x, fit.y, fit.w, fit.h);

  // fixed studio light on round glass: dark rims, a soft highlight that does not move with the label
  const s = Math.min(1, deg / 40);
  const g = ctx.createLinearGradient(body.cx - body.r, 0, body.cx + body.r, 0);
  g.addColorStop(0, `rgba(43,15,20,${0.38 * s})`);
  g.addColorStop(0.2, "rgba(43,15,20,0)");
  g.addColorStop(0.3, `rgba(255,255,255,${0.3 * s})`);
  g.addColorStop(0.4, "rgba(255,255,255,0)");
  g.addColorStop(0.72, "rgba(43,15,20,0)");
  g.addColorStop(1, `rgba(43,15,20,${0.45 * s})`);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

/** Lifts out of the product and zooms a touch, then turns once on its axis like a real round jar as it swings into the box. */
function FlyingJar({ flight, onArrive }: { flight: Flight; onArrive: (id: number) => void }) {
  const product = getProduct(flight.slug);
  const [box] = useState(boxGeometry);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);
  const spin = useMotionValue(0);

  const { x, y, w, h } = flight.from;
  const size = Math.min(Math.max(w, h), MAX_START);
  const startX = x + w / 2 - size / 2;
  const startY = y + h / 2 - size / 2;
  const cx = startX + size / 2;
  const cy = startY + size / 2;

  const inScale = 52 / size; // small enough to fit through the box mouth
  const dx = box.cx - cx;
  const dyAbove = box.mouthY - 34 - cy;
  const dyIn = box.mouthY + 26 - cy;
  // Top of the arc stays just under the navbar so the jar never looks like it is heading for the bag.
  const peak = Math.max(box.mouthY - 70, box.bag.headerBottom + 10) - cy;

  const cutout = product?.cutout;
  const delay = flight.delay;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !cutout) return;
    const px = Math.round(size * Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = px;
    canvas.height = px;

    let fit: Fit | null = null;
    let body: ReturnType<typeof measureBody> = null;
    const img = new window.Image();
    const paint = (deg: number) => fit && paintJar(ctx, img, fit, body, deg);
    img.onload = () => {
      const s = Math.min(px / img.naturalWidth, px / img.naturalHeight); // object-contain
      fit = { w: img.naturalWidth * s, h: img.naturalHeight * s, x: 0, y: 0 };
      fit.x = (px - fit.w) / 2;
      fit.y = (px - fit.h) / 2;
      body = measureBody(img, fit);
      paint(spin.get());
      setPainted(true);
    };
    img.src = cutout;

    const unsubscribe = spin.on("change", paint);
    const controls = animate(spin, JAR_SPIN, { duration: JAR_DURATION, delay, times: JAR_TIMES, ease: JAR_EASE });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [cutout, size, delay, spin]);

  if (!product) return null;

  const timing: Transition = { duration: JAR_DURATION, delay, times: JAR_TIMES, ease: JAR_EASE };

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[97]"
      style={{ width: size, height: size, left: startX, top: startY }}
      initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
      animate={{
        x: [0, 0, 0, dx * 0.55, dx, dx],
        y: [0, -22, -26, peak, dyAbove, dyIn],
        rotate: [0, 0, 0, -6, 3, 0],
        scale: [1, 1.18, 1.18, inScale * 1.6, inScale, inScale * 0.92],
        opacity: [1, 1, 1, 1, 1, 0],
      }}
      transition={timing}
      onAnimationComplete={() => onArrive(flight.id)}
    >
      {/* soft floor shadow that fades as the jar lifts away */}
      <motion.span
        aria-hidden
        className="absolute inset-x-[22%] -bottom-[6%] h-[10%] rounded-[50%] bg-ink/30 blur-md"
        initial={{ scaleX: 1, opacity: 0.6 }}
        animate={{ scaleX: [1, 0.7, 0.7, 0.5, 0.5, 0.5], opacity: [0.6, 0.35, 0.35, 0, 0, 0] }}
        transition={timing}
      />
      {/* the photo shows until the canvas has its first frame */}
      {!painted && <Image src={product.cutout} alt="" fill sizes="200px" className="object-contain drop-shadow-[0_14px_14px_rgba(43,15,20,0.35)]" />}
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full drop-shadow-[0_14px_14px_rgba(43,15,20,0.35)]" />
    </motion.div>
  );
}

type BoxPhase = "open" | "closing" | "sending";

/**
 * Kraft shipping box drawn in two layers (back wall below the jars, front face above them)
 * so a jar dropping in disappears inside it.
 */
function ShippingBox({ phase, onSent }: { phase: BoxPhase; onSent: () => void }) {
  const [geo] = useState(boxGeometry);
  const closed = phase !== "open";
  const sendY = geo.bag.y - (geo.top + BOX_H / 2);
  const sendX = geo.bag.x - geo.cx;

  const motionProps = {
    initial: { x: 220, y: 0, scale: 1, rotate: 12, opacity: 1 },
    animate:
      phase === "sending"
        ? { x: sendX, y: sendY, scale: 0.28, rotate: 0, opacity: 0.2 }
        : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition:
      phase === "sending"
        ? { duration: 0.55, ease: [0.6, 0, 0.3, 1] as const }
        : { type: "spring" as const, stiffness: 170, damping: 17 },
  };
  const style = { left: geo.left, top: geo.top, width: BOX_W, height: BOX_H };

  return (
    <>
      {/* back wall: the dark inside of the box */}
      <motion.div {...motionProps} className="pointer-events-none fixed z-[96]" style={style} aria-hidden>
        <div className="absolute inset-x-[6%] top-0 h-6 rounded-t-md bg-[#8a5a2b]" />
      </motion.div>

      {/* front face + flaps, drawn over the jars */}
      <motion.div
        {...motionProps}
        onAnimationComplete={() => phase === "sending" && onSent()}
        className="pointer-events-none fixed z-[98]"
        style={style}
        aria-hidden
      >
        {/* squash when the flaps shut */}
        <motion.div
          className="absolute inset-0 origin-bottom"
          animate={phase === "closing" ? { scaleY: [1, 0.86, 1.05, 1], scaleX: [1, 1.08, 0.97, 1] } : { scaleY: 1, scaleX: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-x-0 bottom-0 top-3 rounded-b-xl rounded-t-sm bg-[#c98d4e] shadow-[0_18px_30px_-12px_rgba(43,15,20,0.55)]">
            {/* tape stripe + little strawberry stamp */}
            <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-[#e0b07a]/80" />
            <svg viewBox="0 0 32 32" className="absolute bottom-2.5 left-3 h-6 w-6 opacity-80" aria-hidden>
              <path d="M16 7c-6.5 0-11 4.6-11 10.4C5 24 10 29 16 29s11-5 11-11.6C27 11.6 22.5 7 16 7z" fill="#e2323f" />
              <path d="M16 8c-.6-3.2 1.2-5.6 4.6-6-.2 3.2-2 5.4-4.6 6z" fill="#2f7d4f" />
            </svg>
            <span className="absolute bottom-2.5 right-3 font-display text-[0.6rem] font-extrabold tracking-tight text-[#6b3f17]">
              berry&amp;bloom
            </span>
          </div>
          {/* flaps hinge at the top corners: wide open, then fold shut */}
          <motion.div
            className="absolute left-0 top-1.5 h-[18px] w-1/2 origin-bottom-left rounded-sm bg-[#b97c40]"
            style={{ height: FLAP_H }}
            initial={{ rotate: -135 }}
            animate={{ rotate: closed ? 0 : -135 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          />
          <motion.div
            className="absolute right-0 top-1.5 w-1/2 origin-bottom-right rounded-sm bg-[#b97c40]"
            style={{ height: FLAP_H }}
            initial={{ rotate: 135 }}
            animate={{ rotate: closed ? 0 : 135 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.06 }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

function BurstFx({ burst }: { burst: Burst }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
        const dist = 34 + (i % 3) * 14;
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, size: 5 + (i % 3) * 2, round: i % 2 === 0 };
      }),
    [],
  );
  const colors = [burst.color, "var(--color-butter)", "var(--color-jam)", "var(--color-pink)"];

  return (
    <div className="pointer-events-none fixed z-[96]" style={{ left: burst.x, top: burst.y }} aria-hidden>
      {/* expanding ring */}
      <motion.span
        className="absolute -left-6 -top-6 h-12 w-12 rounded-full border-2"
        style={{ borderColor: burst.color }}
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className={`absolute ${d.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2, backgroundColor: colors[i % colors.length] }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{ x: d.x, y: d.y + 10, scale: [0, 1.2, 0], rotate: 180 }}
          transition={{ duration: 0.75, ease: [0.2, 0.8, 0.3, 1] }}
        />
      ))}
      <motion.span
        className="absolute -translate-x-1/2 whitespace-nowrap font-display text-lg font-extrabold text-jam"
        style={{ textShadow: "0 2px 0 var(--color-cream), 0 -2px 0 var(--color-cream), 2px 0 0 var(--color-cream), -2px 0 0 var(--color-cream)" }}
        initial={{ y: 10, opacity: 0, scale: 0.6 }}
        animate={{ y: 34, opacity: [0, 1, 1, 0], scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        +1
      </motion.span>
    </div>
  );
}

function AddedToast() {
  const { notice, dismissNotice, open, subtotal, shownCount } = useCart();
  const [paused, setPaused] = useState(false);
  const product = notice ? getProduct(notice.slug) : undefined;

  useEffect(() => {
    if (!notice || paused) return;
    const id = window.setTimeout(dismissNotice, 3800);
    return () => window.clearTimeout(id);
  }, [notice, paused, dismissNotice]);

  const remaining = Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = Math.min(subtotal / FREE_SHIPPING, 1);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[65] flex justify-center px-3 sm:bottom-6" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {notice && product && (
          <motion.div
            key={notice.id}
            role="status"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            initial={{ y: 120, scale: 0.9, rotate: -3, opacity: 0 }}
            animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
            exit={{ y: 120, scale: 0.9, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-ink p-3 pr-4 text-cream shadow-[0_30px_60px_-20px_rgba(43,15,20,0.7)]"
          >
            <div className="flex items-center gap-3.5">
              <motion.span
                className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
                style={{ backgroundColor: product.palette.bold }}
                initial={{ rotate: -12, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
              >
                <Image src={product.cutout} alt="" fill sizes="64px" className="object-contain p-1.5" />
                <motion.span
                  className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-butter text-ink"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.25 }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              </motion.span>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-butter">Added to your bag</p>
                <p className="truncate font-display text-lg leading-tight">
                  {notice.qty > 1 ? `${notice.qty} × ` : ""}
                  {product.name}
                </p>
                <p className="text-xs text-cream/60">
                  {shownCount} {shownCount === 1 ? "item" : "items"} · {formatPrice(subtotal)}
                </p>
              </div>

              <button
                type="button"
                onClick={open}
                className="shrink-0 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                View bag
              </button>
              <button
                type="button"
                onClick={dismissNotice}
                aria-label="Dismiss"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/60 hover:bg-cream/10 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 px-1">
              <p className="text-[0.72rem] text-cream/70">
                {remaining > 0 ? (
                  <>
                    <span className="font-semibold text-cream">{formatPrice(remaining)}</span> away from free shipping
                  </>
                ) : (
                  <span className="font-semibold text-butter">Free shipping unlocked!</span>
                )}
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/15">
                <motion.div
                  className="h-full origin-left rounded-full bg-butter"
                  initial={{ scaleX: Math.max(progress - 0.15, 0) }}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* time left before the toast tucks itself away */}
            <motion.span
              aria-hidden
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-jam"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: paused ? 1 : 0 }}
              transition={{ duration: paused ? 0.2 : 3.8, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Choreographs every add: jars lift out, swing over and drop into a shipping box that slides in under the navbar;
 * once the last jar is in, the box closes and shoots up into the bag, which then pops.
 */
export function FlyToBag() {
  const { flights, land } = useCart();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [box, setBox] = useState<{ key: number; ids: number[]; phase: BoxPhase } | null>(null);
  const [arrived, setArrived] = useState<number[]>([]);
  const boxKey = useRef(0);

  // Every jar in the air belongs to the open box; open a fresh box when needed.
  useEffect(() => {
    const waiting = flights.map((f) => f.id);
    if (!waiting.length) return;
    setBox((b) => {
      if (!b) return { key: ++boxKey.current, ids: waiting, phase: "open" };
      if (b.phase !== "open") return b; // the box is already on its way; the next one will collect these
      const ids = Array.from(new Set([...b.ids, ...waiting]));
      return ids.length === b.ids.length ? b : { ...b, ids };
    });
  }, [flights]);

  // When everything for this box is inside, shut the flaps, then send it to the bag.
  useEffect(() => {
    if (!box || box.phase !== "open") return;
    if (!box.ids.every((id) => arrived.includes(id))) return;
    const t = window.setTimeout(() => setBox((b) => (b ? { ...b, phase: "closing" } : b)), 120);
    return () => window.clearTimeout(t);
  }, [box, arrived]);

  // Give the flaps a moment to shut and the box to squash before it takes off.
  const closing = box?.phase === "closing";
  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => setBox((b) => (b ? { ...b, phase: "sending" } : b)), 440);
    return () => window.clearTimeout(t);
  }, [closing]);

  const onArrive = useCallback((id: number) => setArrived((a) => [...a, id]), []);

  const onSent = useCallback(() => {
    if (!box) return;
    const at = bagTarget();
    const first = flights.find((f) => box.ids.includes(f.id));
    const color = (first && getProduct(first.slug)?.palette.bold) ?? "var(--color-jam)";
    box.ids.forEach((id) => land(id));
    setArrived((a) => a.filter((id) => !box.ids.includes(id)));
    setBursts((b) => [...b, { id: box.key, x: at.x, y: at.y, color }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== box.key)), 1000);
    setBox(null);
  }, [box, flights, land]);

  return (
    <>
      <AnimatePresence>{box && <ShippingBox key={box.key} phase={box.phase} onSent={onSent} />}</AnimatePresence>
      {flights.map((f) => (
        <FlyingJar key={f.id} flight={f} onArrive={onArrive} />
      ))}
      {bursts.map((b) => (
        <BurstFx key={b.id} burst={b} />
      ))}
      <AddedToast />
    </>
  );
}
