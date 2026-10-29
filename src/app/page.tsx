import { event } from "@/lib/event";
import SplashScreen from "@/components/SplashScreen";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import CalendarButtons from "@/components/CalendarButtons";
import RsvpForm from "@/components/RsvpForm";
import { Reveal } from "@/components/ui";

const ll = `${event.lat},${event.lng}`;
const maps = [
  { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${ll}` },
  { label: "Waze", href: `https://waze.com/ul?ll=${ll}&navigate=yes` },
  { label: "Apple Maps", href: `https://maps.apple.com/?ll=${ll}&q=${encodeURIComponent(event.title)}` },
];

const card = "rounded-2xl border border-line bg-panel p-5 sm:p-6";

function Label({ n, text, right }: { n: string; text: string; right?: string }) {
  return (
    <header className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-mute">
      <span>
        <span className="text-accent-soft">{`/${n}`}</span>
        {` ${text}`}
      </span>
      {right && <span>{right}</span>}
    </header>
  );
}

export default function Home() {
  return (
    <>
      <SplashScreen />
      <main>
        <Hero />

        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-16 md:grid-cols-2 md:px-8">
          <div className="flex flex-col gap-4">
            <Reveal>
              <article className={card}>
                <Label n="01" text="Quando" right="Horário de Brasília" />
                <p className="mt-8 font-dot text-7xl font-bold leading-none sm:text-8xl">{event.dayMonth}</p>
                <p className="mt-2 font-dot text-6xl font-bold leading-none text-accent-soft sm:text-7xl">
                  {event.clock}
                </p>
                <p className="mt-4 text-sm text-mute">{event.dateLabel}</p>
                <div className="mt-6">
                  <CalendarButtons />
                </div>
              </article>
            </Reveal>

            <Reveal delay={150}>
              <article id="onde" className={`${card} scroll-mt-6`}>
                <Label n="02" text="Onde" right="Goiânia, GO" />
                <p className="mt-6 text-base">{event.address}</p>
                <div className="mt-5">
                  <MapSection />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {maps.map((m) => (
                    <a
                      key={m.label}
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm hover:border-accent-soft"
                    >
                      {m.label}
                    </a>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>

          <Reveal delay={300} className="md:sticky md:top-6 md:self-start">
            <article id="confirmar" className={`${card} scroll-mt-6`}>
              <Label n="03" text="Confirmar" right={event.rsvpDeadline ? `Até ${event.rsvpDeadline}` : undefined} />
              <h2 className="mb-6 mt-6 text-2xl font-semibold">Confirme sua presença</h2>
              <RsvpForm />
            </article>
          </Reveal>
        </div>

        <footer className="mx-auto max-w-6xl px-5 pb-10 text-[11px] uppercase tracking-[0.25em] text-mute md:px-8">
          07.11.2026 — Goiânia, GO
        </footer>
      </main>
    </>
  );
}
