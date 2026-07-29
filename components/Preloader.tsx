"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const removeTimer = setTimeout(() => setVisible(false), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 60 60" className="w-14 h-14">
          <circle cx="30" cy="30" r="24" fill="none" stroke="#F2B134" strokeOpacity="0.15" strokeWidth="4" />
          <circle
            cx="30" cy="30" r="24" fill="none" stroke="#F2B134" strokeWidth="4"
            strokeLinecap="round" strokeDasharray="150" strokeDashoffset="110"
            className="animate-spin origin-center"
            style={{ transformOrigin: "30px 30px" }}
          />
        </svg>
        <span className="font-display text-sm text-cream tracking-wide">
          Digitech <span className="text-gold">Nexus</span>
        </span>
      </div>
    </div>
  );
}