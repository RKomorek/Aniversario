import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Mesma esfera de pontos do favicon, para a tela inicial do celular.
const dots: { x: number; y: number; r: number; c: string }[] = [];
for (let j = -3; j <= 3; j++) {
  for (let i = -3; i <= 3; i++) {
    if (i * i + j * j > 10) continue;
    const d = Math.hypot(i, j) / 3.3;
    const nz = Math.sqrt(Math.max(0, 1 - d * d));
    const l = Math.max(0, (-i * 0.45 - j * 0.5) / 3.3 + nz * 0.7);
    dots.push({
      x: 90 + i * 19.29,
      y: 90 + j * 19.29,
      r: (1.6 + 4 * l) * 1.607,
      c: i * i + j * j >= 8 ? "#7c4dff" : "#ecebf0",
    });
  }
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#08080a" }}>
        {dots.map((d, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: d.x - d.r,
              top: d.y - d.r,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: 9999,
              background: d.c,
            }}
          />
        ))}
      </div>
    ),
    size
  );
}
