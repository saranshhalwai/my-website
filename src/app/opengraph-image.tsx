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
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#eeeae2",
        padding: "80px",
        fontFamily: "sans-serif",
        color: "#262721",
      }}
    >
      {/* Top tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 22px",
          borderRadius: "0",
          background: "rgba(181, 59, 40, 0.08)",
          border: "1px solid rgba(181, 59, 40, 0.4)",
          color: "#b53b28",
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
            color: "#262721",
          }}
        >
          Saransh Halwai
        </h1>
        <p
          style={{
            fontSize: "30px",
            color: "#68685e",
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
          borderTop: "1px solid #c9c7bb",
          paddingTop: "24px",
          color: "#68685e",
          fontSize: "22px",
        }}
      >
        <span>B.Tech in CSE @ IIT Indore</span>
        <span>saranshhalwai.vercel.app</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
