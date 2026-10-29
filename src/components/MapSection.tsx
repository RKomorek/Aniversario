"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-xl bg-panel-2" />,
});

export default function MapSection() {
  return <EventMap />;
}
