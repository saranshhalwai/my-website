import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Saransh Halwai | Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#fafafa",
        }}
      >
        {/* Top tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 22px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            color: "#a5b4fc",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          Incoming Developer Intern @ Samsung R&D (SRIB)
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-2px",
              color: "#ffffff",
            }}
          >
            Saransh Halwai
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#a1a1aa",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Full Stack Developer & Systems Enthusiast
          </p>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: "24px",
            color: "#71717a",
            fontSize: "22px",
          }}
        >
          <span>B.Tech in CSE @ IIT Indore</span>
          <span>saranshhalwai.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
