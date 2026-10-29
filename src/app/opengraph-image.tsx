import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const alt = "Convite de aniversário";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080a",
          color: "#ecebf0",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, color: "#8d8c97" }}>VOCÊ ESTÁ CONVIDADO</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 260, fontWeight: 700, lineHeight: 1, color: "#a98bff" }}>
            {event.shortDate}
          </div>
          <div style={{ fontSize: 56, marginTop: 16 }}>{event.title}</div>
        </div>
        <div style={{ fontSize: 32, color: "#8d8c97" }}>
          {`${event.dateLabel}, às ${event.timeLabel}`}
        </div>
      </div>
    ),
    size
  );
}
