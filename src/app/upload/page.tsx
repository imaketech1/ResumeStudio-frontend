"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { portfolioAPI, GeneratedResumeData } from "@/lib/api";
import { Saira } from "next/font/google";

const saira = Saira({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function mapResumeDataToViewModel(data: GeneratedResumeData) {
  const latestJob = data.experience?.[0];

  return {
    user: {
      name: data.name || "",
      tagline: latestJob ? `${latestJob.title} at ${latestJob.company}` : "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      github: data.social_links?.github || "",
      linkedin: data.social_links?.linkedin || "",
      link: data.social_links?.website || data.social_links?.portfolio || "",
    },
    about: data.bio || data.summary || "",
    skills: data.skills || [],
    work: (data.experience || []).map((exp) => ({
      company: exp.company,
      role: exp.title,
      duration: exp.duration,
      description: exp.description,
    })),
    education: (data.education || []).map((edu) => ({
      degree: edu.degree,
      university: edu.institution,
      duration: edu.graduation_year,
    })),
    projects: (data.projects || []).map((project) => ({
      name: project.name,
      description: project.description,
      link: project.link || project.github || "",
    })),
  };
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleRefresh = () => {
    window.location.reload();
  };

  const generateFromFile = async (resumeFile: File) => {
    const data = await portfolioAPI.generate(resumeFile, username.trim());
    const viewModel = mapResumeDataToViewModel(data);
    localStorage.setItem("portfolio", JSON.stringify(viewModel));

    const resumeUrl = URL.createObjectURL(resumeFile);
    localStorage.setItem("resumeUrl", resumeUrl);

    router.push("/portfolio");
  };

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setLoading(true);

    try {
      await generateFromFile(file);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong generating your portfolio. If this is your first request in a while, the free-tier backend may be waking up (cold start) — please try again in ~30 seconds."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError(null);
    setDemoLoading(true);

    try {
      const response = await fetch("/files/resume.pdf");
      if (!response.ok) {
        throw new Error(`Could not load demo resume (${response.status})`);
      }
      const blob = await response.blob();
      const demoFile = new File([blob], "resume.pdf", {
        type: blob.type || "application/pdf",
      });

      await generateFromFile(demoFile);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong generating the demo portfolio. If this is your first request in a while, the free-tier backend may be waking up (cold start) — please try again in ~30 seconds."
      );
    } finally {
      setDemoLoading(false);
    }
  };

  const anyLoading = loading || demoLoading;

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
      <div className="section-box w-full max-w-2xl" style={{ maxWidth: "600px" }}>
        <h1 style={{
          margin: "0 0 1.5rem 0",
          fontSize: "3rem",
          color: "#ff00ff",
          fontFamily: saira.style.fontFamily,
          textShadow: "3px 3px 0px #ffaa00, 6px 6px 0px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}>
          Upload Resume
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "#000",
          margin: "1rem 0 2rem 0",
          fontStyle: "italic",
          fontWeight: "600",
          textAlign: "center",
          lineHeight: "1.6"
        }}>
          Upload your resume PDF and we&apos;ll parse it and use AI to generate your portfolio content.
        </p>

        {/* File input section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            color: "#000",
            fontSize: "0.95rem",
            fontStyle: "italic"
          }}>
            Select Your Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 16px",
              cursor: "pointer"
            }}
          />
          {file && (
            <p style={{
              marginTop: "0.5rem",
              color: "#00aa00",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              ✓ {file.name}
            </p>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleUpload}
          disabled={!file || anyLoading}
          style={{
            width: "100%",
            background: !file || anyLoading ? "#ccc" : "linear-gradient(135deg, #ff00ff, #ff69b4)",
            color: !file || anyLoading ? "#999" : "#fff",
            padding: "16px",
            fontSize: "1.1rem",
            cursor: !file || anyLoading ? "not-allowed" : "pointer",
            opacity: !file || anyLoading ? 0.6 : 1,
          }}
        >
          {loading ? "⏳ Generating..." : "Generate Portfolio"}
        </button>

        {/* Try Demo button */}
        <h3 style={{
          margin: "2rem 0 1rem 0",
          fontSize: "1.2rem",
          color: "#000",
          textAlign: "center",
          fontStyle: "italic"
        }}>
          Or try a demo resume to see how it works:
        </h3>
        <button
          onClick={handleDemo}
          disabled={anyLoading}
          style={{
            width: "100%",
            marginTop: "1rem",
            background: anyLoading ? "#ccc" : "linear-gradient(135deg, #ffaa00, #ffff00)",
            color: anyLoading ? "#999" : "#000",
            padding: "16px",
            fontSize: "1.1rem",
            cursor: anyLoading ? "not-allowed" : "pointer",
            opacity: anyLoading ? 0.6 : 1,
          }}
        >
          {demoLoading ? "⏳ Generating Demo..." : "Try Demo"}
        </button>

        {/* Loading message */}
        {anyLoading && (
          <div className="section-dark" style={{ marginTop: "1.5rem" }}>
            <p style={{
              color: "#ffff00",
              margin: "0",
              fontStyle: "italic",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>
              This can take up to ~30-60s ⏳
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="section-dark" style={{
            marginTop: "1.5rem",
            borderColor: "#ff0000",
            background: "#1a0000"
          }}>
            <p style={{
              color: "#ff6666",
              margin: "0",
              fontStyle: "italic",
              fontSize: "0.95rem",
              lineHeight: "1.5"
            }}>
              ⚠️ {error}
            </p>
          </div>
        )}
      </div>

      {/* Info badge */}
      <div style={{
        padding: "1rem",
        border: "4px solid #ffaa00",
        background: "#000",
        borderRadius: "8px",
        maxWidth: "600px"
      }}>
        <p style={{
          color: "#ffff00",
          fontSize: "0.9rem",
          margin: "0",
          fontStyle: "italic",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          💡 Your resume is processed securely and converted to an awesome portfolio!
        </p>
      </div>

    </div>
  );
}