"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";

const PLANETS = [
  { name: "Sun", key: "sun", icon: "☀️" },
  { name: "Moon", key: "moon", icon: "🌙" },
  { name: "Mars", key: "mars", icon: "🔴" },
  { name: "Mercury", key: "mercury", icon: "🧠" },
  { name: "Jupiter", key: "jupiter", icon: "🟡" },
  { name: "Venus", key: "venus", icon: "💖" },
  { name: "Saturn", key: "saturn", icon: "🪐" },
];

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const params = useParams<{ phonenumber: string }>();
  const phonenumber = params?.phonenumber;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!phonenumber) return;

    async function fetchReport() {
      try {
        const response = await fetch(`/api/getReport?phonenumber=${phonenumber}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    }

    fetchReport();
  }, [phonenumber]);

  const handleToggle = (key: string) => {
    if (isAnimating) return; // Prevent spamming

    setIsAnimating(true);

    if (expanded === key) {
      // Collapse first, then stop animation lock
      setExpanded(null);
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      // Animate non-active cards first, then expand the new card
      setExpanded(null);
      setTimeout(() => {
        setExpanded(key);
        setIsAnimating(false);
      }, 400);
    }
  };

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading Report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar from UI Components */}
      <NavBar />

      {/* ✅ Hero Section */}
      <header className="text-center py-10 bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold">Planetary Influences Report</h1>
        <p className="text-gray-400 text-lg">Comprehensive Analysis of the Seven Celestial Bodies</p>
        <p className="mt-2 text-sm text-gray-300">{new Date().toDateString()}</p>
      </header>

      {/* ✅ Report Section with Enhanced Animation */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {PLANETS.map(({ name, key, icon }) => (
          <div
            key={key}
            className={`bg-white text-black p-4 rounded-lg shadow-lg mb-6 transition-all duration-300 hover:shadow-xl ${expanded === key ? 'scale-[1.02]' : 'scale-100'} animate-fadeInUp`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{icon} {name}</h2>
            </div>

            {/* ✅ First collapse previous card, then expand selected one */}
            <div
              className={`mt-2 overflow-hidden transition-all duration-500 ${expanded === key ? 'max-h-none opacity-100' : 'max-h-20 opacity-60'}`}
            >
              {expanded === key ? report[key] : `${typeof report[key] === 'string' ? (report[key] as string).slice(0, 300) : String(report[key])}...`}
            </div>

            <button
              onClick={() => handleToggle(key)}
              className="text-blue-600 mt-2 transition-all duration-300 hover:text-blue-800"
            >
              {expanded === key ? "Show Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Newsletter from UI Components */}
      <Newsletter />

      {/* ✅ Footer from UI Components */}
      <Footer />
    </div>
  );
}