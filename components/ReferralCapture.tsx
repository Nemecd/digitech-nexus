"use client";
import { useEffect } from "react";

export default function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref");
    if (!code) return;

    // First-click attribution: don't overwrite an existing referral cookie
    if (document.cookie.includes("ref_code=")) return;

    fetch("/api/ref/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          document.cookie = `ref_code=${code}; path=/; max-age=${30 * 24 * 3600}`;
        }
      });
  }, []);

  return null;
}