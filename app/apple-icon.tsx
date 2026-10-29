import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
          borderRadius: 40,
          fontSize: 96,
          fontWeight: 600,
          color: "#fafaf9",
          letterSpacing: "-0.05em",
        }}
      >
        b<span style={{ color: "#78716c" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
