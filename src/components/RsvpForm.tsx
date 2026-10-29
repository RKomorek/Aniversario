"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { event } from "@/lib/event";
import CalendarButtons from "./CalendarButtons";
import { Arrow } from "./ui";

type Companion = { id: number; name: string };
const MAX_COMPANIONS = 10;

const field =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-bone placeholder:text-mute outline-none focus:border-accent-soft focus:ring-2 focus:ring-accent/30";
const label = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-mute";
const check = "h-5 w-5 accent-accent";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [hasCompanions, setHasCompanions] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([{ id: 1, name: "" }]);
  const [hasVegan, setHasVegan] = useState(false);
  const [vegan, setVegan] = useState<string[]>([]);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const filled = companions.filter((c) => c.name.trim());
  const people = [
    { key: "guest", label: name.trim() || "Você" },
    ...(hasCompanions ? filled.map((c) => ({ key: String(c.id), label: c.name.trim() })) : []),
  ];

  const toggleVegan = (key: string) =>
    setVegan((v) => (v.includes(key) ? v.filter((k) => k !== key) : [...v, key]));

  function reset() {
    setStatus("idle");
    setName("");
    setAttending(null);
    setHasCompanions(false);
    setCompanions([{ id: 1, name: "" }]);
    setHasVegan(false);
    setVegan([]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (trap) return setStatus("sent"); // robô: finge que enviou
    if (!name.trim()) return setError("Informe seu nome.");
    if (attending === null) return setError("Diga se você vai ou não.");

    const list = attending && hasCompanions ? filled : [];
    const payload = {
      name: name.trim(),
      attending,
      guest_vegan: attending && hasVegan && vegan.includes("guest"),
      companions: list.map((c) => ({
        name: c.name.trim(),
        vegan: hasVegan && vegan.includes(String(c.id)),
      })),
    };

    setStatus("sending");
    // Sem .select(): o visitante pode inserir, mas não ler.
    const { error: err } = await supabase.from("rsvps").insert(payload);
    if (err) {
      setStatus("idle");
      return setError("Não foi possível enviar. Tente novamente em instantes.");
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-panel-2 p-6 text-center">
        <p className="font-dot text-7xl font-bold leading-none text-accent-soft">OK</p>
        <p className="mt-4 text-lg font-semibold">
          {attending ? "Presença confirmada!" : "Obrigado por avisar!"}
        </p>
        <p className="mt-2 text-sm text-mute">
          {attending
            ? `Te esperamos ${event.dateLabel.toLowerCase()}, às ${event.timeLabel}.`
            : "Que pena que você não vem. Fica para a próxima!"}
        </p>
        {attending && (
          <div className="mt-5 text-left">
            <CalendarButtons />
          </div>
        )}
        <button type="button" onClick={reset} className="mt-5 text-sm text-mute underline">
          Enviar outra resposta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6">
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        name="website"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        className="absolute -left-[9999px]"
      />

      <label className="block">
        <span className={label}>Seu nome</span>
        <input
          className={field}
          value={name}
          maxLength={100}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>

      <div>
        <span className={label}>Você vai?</span>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: true, label: "Vou" },
            { v: false, label: "Não vou" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={attending === o.v}
              onClick={() => setAttending(o.v)}
              className={`rounded-xl border px-4 py-3 text-base font-medium transition-colors ${
                attending === o.v
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-ink text-bone hover:border-accent-soft"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {attending && (
        <>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-base">
              <input
                type="checkbox"
                className={check}
                checked={hasCompanions}
                onChange={(e) => setHasCompanions(e.target.checked)}
              />
              Vou levar acompanhantes
            </label>
            {hasCompanions && (
              <div className="space-y-2">
                {companions.map((c, i) => (
                  <div key={c.id} className="flex gap-2">
                    <input
                      className={field}
                      placeholder={`Acompanhante ${i + 1}`}
                      value={c.name}
                      maxLength={60}
                      onChange={(e) =>
                        setCompanions(
                          companions.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                    />
                    {companions.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remover acompanhante"
                        className="px-3 text-mute hover:text-bone"
                        onClick={() => setCompanions(companions.filter((x) => x.id !== c.id))}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {companions.length < MAX_COMPANIONS && (
                  <button
                    type="button"
                    className="text-sm text-accent-soft underline"
                    onClick={() => setCompanions([...companions, { id: Date.now(), name: "" }])}
                  >
                    Adicionar outro acompanhante
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-base">
              <input
                type="checkbox"
                className={check}
                checked={hasVegan}
                onChange={(e) => setHasVegan(e.target.checked)}
              />
              Tem alguém vegano no grupo
            </label>
            {hasVegan && (
              <fieldset className="space-y-2 pl-8">
                <legend className="mb-1 text-[11px] uppercase tracking-[0.2em] text-mute">
                  Quem é vegano?
                </legend>
                {people.map((p) => (
                  <label key={p.key} className="flex items-center gap-3 text-base">
                    <input
                      type="checkbox"
                      className={check}
                      checked={vegan.includes(p.key)}
                      onChange={() => toggleVegan(p.key)}
                    />
                    {p.label}
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-between rounded-xl bg-accent py-2 pl-5 pr-2 text-base font-semibold text-white disabled:opacity-60"
      >
        <span>{status === "sending" ? "Enviando..." : "Enviar resposta"}</span>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-black/30 transition-transform group-hover:translate-x-0.5">
          <Arrow />
        </span>
      </button>
    </form>
  );
}
