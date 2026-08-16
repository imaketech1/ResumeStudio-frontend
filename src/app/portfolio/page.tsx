"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Work from "@/components/Work";
import Education from "@/components/Education";
import Projects from "../projects/page";
import Contact from "../contact/page";

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("portfolio");
    const resumeUrl = localStorage.getItem("resumeUrl");

    if (stored) {
      const parsed = JSON.parse(stored);

      // attach CV safely
      if (parsed?.user) {
        parsed.user.cv = resumeUrl || undefined;
      }

      setData(parsed);
      setStatus("ready");
    } else {
      setStatus("empty");
    }
  }, []);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading your portfolio...</p>
        </div>
      </main>
    );
  }

  if (status === "empty" || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-white dark:bg-gray-950 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          No portfolio yet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          We couldn&apos;t find a generated portfolio in this browser. Upload
          your resume to create one.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition"
        >
          Upload Resume
        </button>
      </main>
    );
  }

  return (
    <main>
      <Hero user={data.user} about={data.about} />
      <Skills skills={data.skills} />
      <Work work={data.work} />
      <Education education={data.education} />
      <Projects projects={data.projects} />
      <Contact user={data.user} />
    </main>
  );
}
