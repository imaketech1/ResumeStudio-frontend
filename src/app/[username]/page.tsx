"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { portfolioAPI, PortfolioResponse } from "@/lib/api";

export default function PublicPortfolioPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getByUsername(username);
        setPortfolio(data);
      } catch (err) {
        console.error(err);
        setError("Portfolio not found, or the backend is still waking up. Try refreshing in ~30s.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading portfolio for @{username}...</p>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-red-500 max-w-md">{error ?? "Portfolio not found."}</p>
      </main>
    );
  }

  const { user_info, ai_generated_content, resume_data } = portfolio;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{user_info?.name}</h1>
        {ai_generated_content?.headline && (
          <p className="text-lg text-blue-500">{ai_generated_content.headline}</p>
        )}
        {user_info?.location && (
          <p className="text-sm text-gray-500">{user_info.location}</p>
        )}
      </section>

      {/* Bio */}
      {ai_generated_content?.bio && (
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{ai_generated_content.bio}</p>
        </section>
      )}

      {/* Skills */}
      {resume_data?.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          {ai_generated_content?.skills_description && (
            <p className="text-gray-600 mb-3">{ai_generated_content.skills_description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {resume_data.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Career highlights */}
      {ai_generated_content?.career_highlights?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Career Highlights</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {ai_generated_content.career_highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience */}
      {resume_data?.experience?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <div className="space-y-4">
            {resume_data.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-blue-400 pl-4">
                <p className="font-medium">{exp.title} — {exp.company}</p>
                {exp.duration && <p className="text-sm text-gray-400">{exp.duration}</p>}
                {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects (AI-enhanced where available) */}
      {resume_data?.projects?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <div className="space-y-4">
            {resume_data.projects.map((project, i) => {
              const enhanced = ai_generated_content?.project_descriptions?.find(
                (p) => p.project_name === project.name
              );
              return (
                <div key={i} className="border rounded-lg p-4">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-gray-600 mt-1">
                    {enhanced?.enhanced_description ?? project.description}
                  </p>
                  {enhanced?.impact && (
                    <p className="text-sm text-blue-500 mt-1">Impact: {enhanced.impact}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {resume_data?.education?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <div className="space-y-2">
            {resume_data.education.map((edu, i) => (
              <div key={i}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-500">
                  {edu.institution} {edu.graduation_year ? `· ${edu.graduation_year}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resume PDF link, if backend provides one */}
      {portfolio.pdf_url && (
        <section className="text-center">
          <a
            href={portfolio.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download Resume (PDF)
          </a>
        </section>
      )}

      {/* Contact */}
      <section className="text-center text-sm text-gray-500 space-x-3">
        {user_info?.email && <span>{user_info.email}</span>}
        {user_info?.phone && <span>· {user_info.phone}</span>}
      </section>
    </main>
  );
}