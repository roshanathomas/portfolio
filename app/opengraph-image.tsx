import { ImageResponse } from "next/og";

export const alt = "Roshan Thomas — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically generated social preview card (no external assets to fetch).
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(60% 90% at 50% 0%, #1b1640 0%, #0a0a0f 70%)",
          color: "#e7e7ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#7c5cff", letterSpacing: 2 }}>
          // AI Engineer
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            marginTop: 12,
            letterSpacing: -2,
          }}
        >
          Roshan Thomas
        </div>
        <div
          style={{
            fontSize: 36,
            color: "rgba(231,231,238,0.8)",
            marginTop: 24,
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          Production AI systems — tool-using agents, multimodal apps, and
          full-stack platforms where the LLM is one part of the architecture.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
            fontSize: 24,
            color: "#5eead4",
          }}
        >
          <span>MCP tools</span>
          <span style={{ color: "rgba(231,231,238,0.3)" }}>·</span>
          <span>Spring AI</span>
          <span style={{ color: "rgba(231,231,238,0.3)" }}>·</span>
          <span>Eval engineering</span>
        </div>
      </div>
    ),
    size,
  );
}
