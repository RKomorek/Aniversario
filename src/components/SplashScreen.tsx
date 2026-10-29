"use client";

import { useEffect, useRef, useState } from "react";

const BLOCK = 10;
const DURATION = 1100;
const FADE = 300;

// Abertura curta: um íris pixelado que se abre e revela o convite.
export default function SplashScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("splash-seen") === "1";
    } catch {}

    if (seen) {
      root.classList.add("intro-done");
      setVisible(false);
      return;
    }

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      root.classList.add("intro-done");
      setStarted(true);
      setFading(true);
      try {
        sessionStorage.setItem("splash-seen", "1");
      } catch {}
      timeout = setTimeout(() => setVisible(false), reduce ? 200 : FADE);
    };

    if (reduce) {
      finish();
      return () => clearTimeout(timeout);
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    const size = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    size();
    window.addEventListener("resize", size);

    const ring = (n: number, min: number, span: number) =>
      Array.from({ length: n }, (_, i) => ({
        a: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.02,
        f: min + Math.random() * span,
      }));
    const outer = ring(360, 0.85, 0.3);
    const inner = ring(180, 0.92, 0.12);
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const e = 1 - Math.pow(1 - t, 3);
      const R = (Math.hypot(w, h) / 2) * e;
      const cx = w / 2;
      const cy = h / 2;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, R - BLOCK * 2), 0, Math.PI * 2);
      ctx.fill();
      for (const r of outer) {
        const rad = R * r.f;
        ctx.fillRect(cx + Math.cos(r.a) * rad - BLOCK / 2, cy + Math.sin(r.a) * rad - BLOCK / 2, BLOCK, BLOCK);
      }
      const s = BLOCK * 0.8;
      for (const r of inner) {
        const rad = R * r.f;
        ctx.fillRect(cx + Math.cos(r.a) * rad - s / 2, cy + Math.sin(r.a) * rad - s / 2, s, s);
      }

      setStarted(true); // o canvas já está preto: pode soltar o fundo do overlay
      if (t < 1) raf = requestAnimationFrame(frame);
      else finish();
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      window.removeEventListener("resize", size);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      onClick={() => {
        document.documentElement.classList.add("intro-done");
        setFading(true);
        setTimeout(() => setVisible(false), FADE);
      }}
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        started ? "" : "bg-ink"
      } ${fading ? "pointer-events-none opacity-0" : ""}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
