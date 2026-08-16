"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/ThemeProvider";
import { Sun, Moon, Github, Linkedin, Globe } from "lucide-react";

type User = {
  name: string;
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  link?: string;
};

export default function Hero({
  user,
  about,
}: {
  user: User;
  about: string;
}) {
  const { theme, toggleTheme } = useTheme();

  const isValidUrl = (url?: string) => {
    if (!url || url.trim() === "") return false;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasLink = isValidUrl(user.link);
  const hasAbout = about?.trim();

  return (
    <section className="relative flex flex-col items-center justify-center h-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 animate-pulse" />

      {/* Theme Toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200 }}
        onClick={toggleTheme}
        className={`absolute top-10 left-10 w-16 h-16 flex items-center justify-center rounded-full shadow-lg 
          ${theme === "dark" ? "bg-blue-600 text-white" : "bg-yellow-400 text-black"}
        `}
      >
        {theme === "dark" ? <Moon size={28} /> : <Sun size={28} />}
      </motion.button>

      {/* Floating Shapes */}
      <motion.div
        animate={{ x: [0, 30, 0], rotate: [0, -180, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500 rotate-45 opacity-30"
      />

      <motion.div
        animate={{ x: [-20, 20, -20], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 left-10 w-20 h-20 bg-red-500 rotate-12 opacity-30"
      />

      {/* Name */}
      <h1 className="text-5xl font-bold">
        Hi, I&apos;m <span className="text-blue-400">{user.name}</span>
      </h1>

      {/* Tagline */}
      {user.tagline && (
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {user.tagline}
        </p>
      )}

      {/* Location */}
      {user.location?.trim() && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {user.location}
        </p>
      )}

      {/* About */}
      {hasAbout && (
        <motion.p
          className="mt-6 text-lg max-w-2xl text-center leading-relaxed text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {about}
        </motion.p>
      )}

      {/* Social Links */}
      <div className="mt-6 flex gap-6 relative z-10">
        {hasLink && (
          <a href={user.link} target="_blank" rel="noopener noreferrer">
            <Globe size={32} />
          </a>
        )}

        {user.github?.trim() && (
          <a href={user.github} target="_blank" rel="noopener noreferrer">
            <Github size={32} />
          </a>
        )}

        {user.linkedin?.trim() && (
          <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={32} />
          </a>
        )}
      </div>
    </section>
  );
}