export default function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="absolute inset-0 w-full h-full opacity-70"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B7FE0" />
          <stop offset="100%" stopColor="#1AA3E8" />
        </linearGradient>
      </defs>

      {/* Orbit rings */}
      <circle cx="300" cy="300" r="220" fill="none" stroke="#F2B134" strokeOpacity="0.15" />
      <circle
        cx="300" cy="300" r="160" fill="none" stroke="#2B7FE0" strokeOpacity="0.2"
        className="animate-spin-slow"
      />

      {/* Signature arc, echoing the logo swoosh */}
      <path
        d="M 80 340 A 250 250 0 0 1 520 260"
        fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="900" className="animate-draw"
      />

      {/* Flight path */}
      <path
        d="M 100 420 Q 300 480 500 380"
        fill="none" stroke="#F2B134" strokeWidth="2" strokeDasharray="6 8"
        strokeLinecap="round" opacity="0.6"
      />

      {/* Pulsing nodes (countries served) */}
      {[[100, 420], [220, 460], [340, 440], [460, 400], [500, 380]].map(([cx, cy], i) => (
        <circle
          key={i} cx={cx} cy={cy} r="5" fill="#F2B134"
          className="animate-pulse-node" style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      {/* Slow-rotating star cluster */}
      <g className="animate-spin-slower">
        <circle cx="300" cy="220" r="3" fill="#2B7FE0" />
        <circle cx="330" cy="200" r="2.5" fill="#F2B134" />
        <circle cx="270" cy="195" r="2" fill="#2B7FE0" />
      </g>
    </svg>
  );
}