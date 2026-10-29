import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          fontSize: 17,
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
