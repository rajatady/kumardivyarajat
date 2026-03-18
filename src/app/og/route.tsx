import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Kumar Divya Rajat";
  const description = searchParams.get("description") || "";
  const date = searchParams.get("date") || "";
  const type = searchParams.get("type") || "article";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FDFBF7",
          padding: "60px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#C45D3E",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {/* Type label */}
          <div
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#8B8680",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "24px",
            }}
          >
            {type === "project" ? "Project" : date ? `${date}` : "Blog"}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? "42px" : "52px",
              fontWeight: 500,
              color: "#1A1A1A",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
              marginBottom: description ? "20px" : "0",
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: "22px",
                color: "#4A4A4A",
                lineHeight: 1.5,
                maxWidth: "800px",
              }}
            >
              {description.length > 120
                ? description.slice(0, 120) + "..."
                : description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Logo square */}
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#C45D3E",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FDFBF7",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              KDR
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#1A1A1A",
              }}
            >
              kumardivyarajat.com
            </div>
          </div>

          <div
            style={{
              fontSize: "16px",
              color: "#8B8680",
            }}
          >
            @Rajat225
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
