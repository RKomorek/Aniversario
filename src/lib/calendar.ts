import { event } from "./event";

// 2026-11-07T12:00:00-03:00 -> 20261107T150000Z
const fmt = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const description = (url: string) =>
  `Venha comemorar! Sem hora para terminar. Mais informações e confirmação de presença: ${url}`;

export function googleCalendarUrl(siteUrl: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt ?? new Date(new Date(event.startsAt).getTime() + 3600000).toISOString())}`,
    details: description(siteUrl),
    location: event.address,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const fold = (l: string) => l.replace(/(.{60})(?=.)/g, "$1\r\n ");

export function buildIcs(siteUrl: string) {
  const alarm = (trigger: string, text: string) => [
    "BEGIN:VALARM",
    `TRIGGER:${trigger}`,
    "ACTION:DISPLAY",
    `DESCRIPTION:${text}`,
    "END:VALARM",
  ];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Convite de Aniversario//PT-BR//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:aniversario-2026-11-07@convite",
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(event.startsAt)}`,
    ...(event.endsAt ? [`DTEND:${fmt(event.endsAt)}`] : []),
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(description(siteUrl))}`,
    `LOCATION:${esc(event.address)}`,
    `URL:${siteUrl}`,
    ...alarm("-P1D", "Amanhã tem festa!"),
    ...alarm("-PT2H", "A festa começa em 2 horas"),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
