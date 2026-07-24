import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundColor: "#171312",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(215,176,118,0.35), transparent 40%), radial-gradient(circle at 85% 85%, rgba(142,111,76,0.25), transparent 35%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#f5efe6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
              color: "#171312",
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#f5efe6",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            CodeMap
          </div>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          Understand a codebase without reading every file.
        </div>
        <div
          style={{
            marginTop: "28px",
            fontSize: "26px",
            color: "#d6cfc2",
            maxWidth: "820px",
          }}
        >
          Paste a GitHub repo. Get stack, structure, and setup notes in under
          two minutes.
        </div>
      </div>
    ),
    { ...size }
  );
}
