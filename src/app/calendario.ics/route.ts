import { buildIcs } from "@/lib/calendar";

export function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return new Response(buildIcs(origin), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="aniversario.ics"',
    },
  });
}
