"use client";

import { useEffect, useState } from "react";
import { googleCalendarUrl } from "@/lib/calendar";
import { Arrow } from "./ui";

const btn =
  "group flex flex-1 items-center justify-between gap-3 rounded-xl border border-line bg-panel-2 py-2 pl-4 pr-2 text-sm text-bone hover:border-accent-soft";
const icon =
  "grid h-9 w-9 place-items-center rounded-lg bg-accent text-white transition-transform group-hover:translate-x-0.5";

export default function CalendarButtons() {
  const [google, setGoogle] = useState("#");
  useEffect(() => setGoogle(googleCalendarUrl(window.location.origin)), []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a className={btn} href={google} target="_blank" rel="noreferrer">
        Google Agenda
        <span className={icon}>
          <Arrow className="h-4 w-4" />
        </span>
      </a>
      <a className={btn} href="/calendario.ics">
        Apple e outros (.ics)
        <span className={icon}>
          <Arrow className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}
