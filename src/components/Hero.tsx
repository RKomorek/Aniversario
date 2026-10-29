"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/event";
import DitherField from "./DitherField";
import { Arrow } from "./ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const target = new Date(event.startsAt).getTime();

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = left === null ? null : Math.floor(left / 1000);
  const parts = [
    { label: "dias", v: s === null ? null : Math.floor(s / 86400) },
    { label: "horas", v: s === null ? null : Math.floor((s % 86400) / 3600) },
    { label: "min", v: s === null ? null : Math.floor((s % 3600) / 60) },
    { label: "seg", v: s === null ? null : s % 60 },
  ];

  return (
    <div
      role="timer"
      aria-label="Contagem regressiva para a festa"
      className="grid max-w-md grid-cols-4 gap-2"
    >
      {parts.map((p) => (
        <div key={p.label} className="rounded-xl border border-line bg-panel/80 px-3 py-2 backdrop-blur">
          <p className="font-dot text-4xl font-bold leading-none">
            {p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mute">{p.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <DitherField className="absolute inset-0 -z-10 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-5 pb-8 pt-6 md:px-8">
        <div
          className="hero-in flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-mute"
          style={d(100)}
        >
          <span>
            <span className="text-accent-soft">/00</span> Convite
          </span>
          <span>Goiânia, GO</span>
        </div>

        <div className="space-y-6">
          <div className=" px-2 py-1 rounded-xl bg-accent-soft/25 w-fit border border-accent-soft/50">
            <p className="hero-in text-xs uppercase tracking-[0.3em] text-white" style={d(300)}>
              Você está convidado
            </p>
          </div>
          <h1
            className="hero-in whitespace-nowrap font-dot text-[24vw] font-bold leading-[0.8] tracking-tight sm:text-[11rem] lg:text-[13rem]"
            style={d(500)}
          >
            {event.shortDate}
          </h1>
          <div className="hero-in space-y-1" style={d(700)}>
            <p className="text-xl md:text-2xl">{event.title}</p>
            <p className="text-sm text-mute">{`${event.dateLabel}, às ${event.timeLabel}`}</p>
          </div>
          <div className="hero-in" style={d(850)}>
            <Countdown />
          </div>
          <div className="hero-in flex flex-col gap-3 sm:flex-row" style={d(1000)}>
            <a
              href="#confirmar"
              className="group inline-flex items-center justify-between gap-4 rounded-xl bg-accent py-2 pl-5 pr-2 text-sm font-semibold text-white"
            >
              Confirmar presença
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-black/30 transition-transform group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </a>
            <a
              href="#onde"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-panel/80 px-5 py-3 text-sm backdrop-blur hover:border-accent-soft"
            >
              Ver local
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
