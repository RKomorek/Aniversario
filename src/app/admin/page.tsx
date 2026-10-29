"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Arrow } from "@/components/ui";

type Row = {
  id: string;
  created_at: string;
  name: string;
  attending: boolean;
  guest_vegan: boolean;
  companions: { name: string; vegan: boolean }[];
};
type Filter = "all" | "yes" | "no";

const field =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-bone placeholder:text-mute outline-none focus:border-accent-soft focus:ring-2 focus:ring-accent/30";
const ghost =
  "rounded-lg border border-line bg-panel px-3 py-2 text-xs uppercase tracking-[0.15em] text-mute hover:border-accent-soft hover:text-bone";
const tag =
  "rounded bg-panel-2 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-accent-soft";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setError("");
    const { data, error: err } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError("Não foi possível carregar a lista.");
    else setRows(data as Row[]);
  }, []);

  const isAdmin = session?.user.app_metadata?.role === "admin";
  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError("E-mail ou senha incorretos.");
  }

  // Mantém só a resposta mais recente de cada nome.
  const latest = new Map<string, Row & { resends: number }>();
  for (const r of rows) {
    const k = r.name.trim().toLowerCase();
    const cur = latest.get(k);
    if (cur) cur.resends++;
    else latest.set(k, { ...r, resends: 0 });
  }
  const list = [...latest.values()];
  const going = list.filter((r) => r.attending);
  const people = going.reduce((n, r) => n + 1 + r.companions.length, 0);
  const vegans = going.reduce(
    (n, r) => n + (r.guest_vegan ? 1 : 0) + r.companions.filter((c) => c.vegan).length,
    0
  );
  const shown = list.filter((r) => (filter === "all" ? true : filter === "yes" ? r.attending : !r.attending));

  const stats = [
    { label: "Pessoas confirmadas", value: people, hi: true },
    { label: "Grupos que vão", value: going.length },
    { label: "Não vão", value: list.length - going.length },
    { label: "Veganos", value: vegans },
  ];
  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "Todos", n: list.length },
    { key: "yes", label: "Vão", n: going.length },
    { key: "no", label: "Não vão", n: list.length - going.length },
  ];

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-mute">
              <span className="text-accent-soft">/admin</span> Convite
            </p>
            <h1 className="mt-2 font-dot text-5xl font-bold leading-none sm:text-6xl">CONVIDADOS</h1>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button className={ghost} onClick={load}>
                Atualizar
              </button>
              <button className={ghost} onClick={() => supabase.auth.signOut()}>
                Sair
              </button>
            </div>
          )}
        </header>

        {!ready ? null : !session ? (
          <form onSubmit={login} className="mx-auto max-w-sm space-y-4 rounded-2xl border border-line bg-panel p-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-mute">
              <span className="text-accent-soft">/01</span> Acesso
            </p>
            <input
              className={field}
              type="email"
              autoComplete="username"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={field}
              type="password"
              autoComplete="current-password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <button className="group flex w-full items-center justify-between rounded-xl bg-accent py-2 pl-5 pr-2 text-base font-semibold text-white">
              Entrar
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-black/30 transition-transform group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </button>
          </form>
        ) : !isAdmin ? (
          <div className="space-y-3 rounded-2xl border border-line bg-panel p-6">
            <p>Esta conta não tem permissão para ver a lista.</p>
            <button className={ghost} onClick={() => supabase.auth.signOut()}>
              Sair
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-panel p-4">
                  <p
                    className={`font-dot text-5xl font-bold leading-none ${s.hi ? "text-accent-soft" : ""}`}
                  >
                    {String(s.value).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-mute">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar respostas">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={filter === t.key}
                  onClick={() => setFilter(t.key)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    filter === t.key
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-panel text-bone hover:border-accent-soft"
                  }`}
                >
                  {`${t.label} (${t.n})`}
                </button>
              ))}
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <ul className="mt-4 space-y-3">
              {shown.length === 0 && (
                <li className="rounded-2xl border border-line bg-panel p-5 text-mute">
                  Nenhuma resposta aqui ainda.
                </li>
              )}
              {shown.map((r) => (
                <li key={r.id} className="rounded-2xl border border-line bg-panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-semibold">
                        {r.name}
                        {r.guest_vegan && <span className={tag}>vegano</span>}
                      </p>
                      <p className="mt-1 text-xs text-mute">
                        {new Date(r.created_at).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.15em] ${
                        r.attending
                          ? "border-accent/50 bg-accent/20 text-accent-soft"
                          : "border-line bg-panel-2 text-mute"
                      }`}
                    >
                      {r.attending ? "Vai" : "Não vai"}
                    </span>
                  </div>

                  {r.companions.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-mute">{`+ ${r.companions.length}`}</span>
                      {r.companions.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-2 rounded-lg bg-panel-2 px-2.5 py-1"
                        >
                          {c.name}
                          {c.vegan && <span className={tag}>vegano</span>}
                        </span>
                      ))}
                    </div>
                  )}

                  {r.resends > 0 && (
                    <p className="mt-3 text-xs text-mute">
                      {`Respondeu ${r.resends + 1} vezes; mostrando a mais recente.`}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
