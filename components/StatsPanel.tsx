"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frame: number;
    function tick(t: number) {
      if (startTime === null) startTime = t;
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return value;
}

type Stat = { value: number; suffix: string; label: string };

export default function StatsPanel({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 rounded-3xl bg-white/8 backdrop-blur-md border border-white/15 p-10 text-cream">
      <div className="grid grid-cols-2 gap-8">
        {stats.map((s) => (
          <StatItem key={s.label} stat={s} start={inView} />
        ))}
      </div>
    </div>
  );
}

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const count = useCountUp(stat.value, 1600, start);
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-gold">
        {count}{stat.suffix}
      </div>
      <div className="text-xs text-cream/60 mt-1">{stat.label}</div>
    </div>
  );
}