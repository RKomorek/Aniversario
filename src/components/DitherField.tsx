"use client";

import { useEffect, useRef } from "react";

// Meio-tom animado: uma esfera feita de pontos, com anel roxo e ondas de ruído.
// Substitui o vídeo de fundo: leve, nítido em qualquer tela e sem arquivo para baixar.
export default function DitherField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cell = 12;
    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      const t = reduce ? 2 : now / 1000;
      ctx.clearRect(0, 0, w, h);

      const wide = w >= 768;
      const R = Math.min(w, h) * (wide ? 0.42 : 0.36);
      const cx = w * (wide ? 0.7 : 0.5) + Math.sin(t * 0.3) * 6;
      const cy = h * (wide ? 0.48 : 0.36) + Math.cos(t * 0.25) * 6;
      const white = new Path2D();
      const violet = new Path2D();
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const lx = -0.5 + Math.sin(t * 0.4) * 0.25;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell + cell / 2;
          const y = j * cell + cell / 2;
          const dx = (x - cx) / R;
          const dy = (y - cy) / R;
          const d2 = dx * dx + dy * dy;
          let v: number;

          if (d2 < 1) {
            const nz = Math.sqrt(1 - d2);
            v = Math.max(0, dx * lx + dy * -0.55 + nz * 0.7);
            v *= 0.75 + 0.25 * Math.sin(dy * 9 + t * 0.8 + dx * 2);
          } else {
            const wave = 0.5 + 0.5 * Math.sin(x * 0.018 + t * 0.5 + Math.sin(y * 0.012 - t * 0.3) * 2.2);
            const fall = Math.max(0, 1 - (Math.sqrt(d2) - 1) * 0.9);
            v = wave * wave * 0.32 * fall;
          }

          let r = v * cell * 0.5;
          const rim = d2 >= 1 && d2 < 1.1;
          if (rim) r = Math.max(r, cell * 0.3);
          if (r < 0.5) continue;

          const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
          const rnd = s - Math.floor(s);
          const p = rim || (rnd > 0.985 && v > 0.15) ? violet : white;
          p.moveTo(x + r, y);
          p.arc(x, y, r, 0, Math.PI * 2);
        }
      }

      ctx.fillStyle = "rgba(236, 235, 240, 0.9)";
      ctx.fill(white);
      ctx.fillStyle = "#9d74ff";
      ctx.fill(violet);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = w < 640 ? 10 : 12;
      draw(performance.now());
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return; // ~30 fps
      last = now;
      draw(now);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
