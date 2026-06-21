import { useState } from "react";

export function Redesign() {
  const [workshopHover, setWorkshopHover] = useState(false);
  const [councilHover, setCouncilHover] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f2ee",
        fontFamily: "'Georgia', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "700",
            color: "#1c1c1c",
            letterSpacing: "-1px",
            marginBottom: "14px",
            lineHeight: 1.1,
          }}
        >
          The Writing Circle
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#444",
            fontStyle: "italic",
            letterSpacing: "0.2px",
          }}
        >
          Let your story be challenged.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          width: "100%",
          maxWidth: "820px",
        }}
      >
        {/* Workshop Card */}
        <div
          onMouseEnter={() => setWorkshopHover(true)}
          onMouseLeave={() => setWorkshopHover(false)}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "40px 36px",
            cursor: "pointer",
            border: workshopHover ? "2px solid #1c1c1c" : "2px solid transparent",
            boxShadow: workshopHover
              ? "0 12px 40px rgba(0,0,0,0.14)"
              : "0 4px 20px rgba(0,0,0,0.07)",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "28px" }}>✍️</div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#1c1c1c",
              margin: 0,
            }}
          >
            The Workshop
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#555",
              lineHeight: "1.6",
              margin: 0,
              flexGrow: 1,
            }}
          >
            Share your writing and hear from five distinct voices — each with a different lens, a different instinct.
          </p>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: workshopHover ? "#1c1c1c" : "#888",
              letterSpacing: "0.5px",
              transition: "color 0.2s ease",
              marginTop: "8px",
            }}
          >
            Enter →
          </div>
        </div>

        {/* Council Card */}
        <div
          onMouseEnter={() => setCouncilHover(true)}
          onMouseLeave={() => setCouncilHover(false)}
          style={{
            flex: 1,
            backgroundColor: "#1c1c1c",
            borderRadius: "16px",
            padding: "40px 36px",
            cursor: "pointer",
            border: councilHover ? "2px solid #888" : "2px solid transparent",
            boxShadow: councilHover
              ? "0 12px 40px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "28px" }}>⚡</div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#f5f2ee",
              margin: 0,
            }}
          >
            The Council
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#bbb",
              lineHeight: "1.6",
              margin: 0,
              flexGrow: 1,
            }}
          >
            Bring a story problem. Six AI agents debate it from every angle. They won't agree — that's the point.
          </p>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: councilHover ? "#f5f2ee" : "#777",
              letterSpacing: "0.5px",
              transition: "color 0.2s ease",
              marginTop: "8px",
            }}
          >
            Enter →
          </div>
        </div>
      </div>
    </div>
  );
}
