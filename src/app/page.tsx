"use client";

import { useRouter } from "next/navigation";
import { Saira } from "next/font/google";

const saira = Saira({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function HomePage() {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="retro-theme" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      gap: "2rem",
    }}>
      <div
        className="section-dark w-full max-w-2xl"
        onClick={handleRefresh}
        style={{ cursor: "pointer" }}
      >
        <center>
          <h1 style={{
            margin: "0 0 1.5rem 0",
            fontSize: "3.5rem",
            color: "#ff00ff",
            textShadow: "3px 3px 0px #ffaa00, 6px 6px 0px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease",
            fontFamily: saira.style.fontFamily,

          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}>
            Resume Studio
          </h1>
        </center>
      </div>

      {/* Main content box */}
      <div className="section-box w-full max-w-2xl">
        <p style={{
          fontSize: "1.3rem",
          color: "#000",
          margin: "1rem 0",
          fontStyle: "italic",
          fontWeight: "bold",
          letterSpacing: "1px"
        }}>
          Turn your resume into a portfolio in seconds
        </p>

        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => router.push("/upload")}
            style={{
              background: "linear-gradient(135deg, #ff00ff, #ff69b4)",
              color: "#fff",
              padding: "16px 32px",
              fontSize: "1.2rem",
              cursor: "pointer",
              minWidth: "250px"
            }}
          >
            Generate Portfolio
          </button>
        </div>
      </div>

      {/* Footer badge */}
      <div style={{
        marginTop: "3rem",
        padding: "1rem",
        border: "4px solid #ffff00",
        background: "#000",
        borderRadius: "8px"
      }}>
        <p style={{
          color: "#ffff00",
          fontSize: "1rem",
          margin: "0",
          fontStyle: "italic",
          fontWeight: "bold"
        }}>
          ✨ AI-Powered Portfolio Generator ✨
        </p>
      </div>
    </div>
  );
}