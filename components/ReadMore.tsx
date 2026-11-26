"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Shows the first few lines of a long text with a soft fade, and a "Read more"
// button that smoothly opens the rest. Short texts show in full with no button.
export default function ReadMore({
  text,
  lines = 3,
  className = "",
  textClassName = "text-sm leading-6 text-slate whitespace-pre-wrap",
  buttonClassName = "text-gold hover:text-gold/80",
}: {
  text: string;
  lines?: number;
  className?: string;
  textClassName?: string;
  buttonClassName?: string;
}) {
  const innerRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [lineHeight, setLineHeight] = useState(24);
  const [fullHeight, setFullHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      if (!Number.isNaN(lh)) setLineHeight(lh);
      setFullHeight(el.scrollHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  const collapsedHeight = lineHeight * lines;
  const overflowing = fullHeight > collapsedHeight + 2;
  const fade = "linear-gradient(to bottom, #000 55%, transparent 100%)";

  return (
    <div className={className}>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{
          maxHeight: expanded ? fullHeight : collapsedHeight,
          ...(overflowing && !expanded ? { WebkitMaskImage: fade, maskImage: fade } : {}),
        }}
      >
        <p ref={innerRef} className={textClassName}>
          {text}
        </p>
      </div>

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold transition-colors ${buttonClassName}`}
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
