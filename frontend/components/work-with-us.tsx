"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const cards = [
  {
    emoji: "👤",
    title: "For Job Seekers",
    description:
      "Find your dream job with our intelligent matching and career resources.",
    cta: "Browse Jobs",
  },
  {
    emoji: "🏢",
    title: "For Employers",
    description:
      "Post jobs, find top talent, and build your team with powerful tools.",
    cta: "Post a Job",
  },
  {
    emoji: "🤝",
    title: "For Partners",
    description:
      "Collaborate with us to expand opportunities and grow together.",
    cta: "Become a Partner",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function WorkWithUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`py-16 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Work With Us</h2>
        <p className="text-lg max-w-2xl mx-auto opacity-80">
          Whether you&apos;re looking for a job, hiring talent, or exploring
          partnerships, we have the right solution for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className={`rounded-2xl p-8 flex flex-col items-center text-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-5xl mb-4">{card.emoji}</span>
            <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
            <p className="mb-6 text-sm leading-relaxed opacity-80">
              {card.description}
            </p>
            <button
              className={`mt-auto px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {card.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}