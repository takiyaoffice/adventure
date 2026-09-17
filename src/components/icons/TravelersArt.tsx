/**
 * Original chibi/pixel-flavoured illustration of two elderly adventurers.
 * Built from simple geometric blocks (no traced or copied artwork).
 */
export function TravelersArt({ className = 'w-40 h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} shapeRendering="crispEdges">
      {/* ground shadow */}
      <ellipse cx="100" cy="182" rx="66" ry="9" fill="#1c120a" opacity="0.25" />

      {/* --- Father (left) --- */}
      <g transform="translate(28,30)">
        {/* staff */}
        <rect x="66" y="18" width="5" height="110" rx="2" fill="#7a4f2c" />
        <circle cx="68.5" cy="16" r="6" fill="#d9b356" />
        {/* legs */}
        <rect x="18" y="112" width="16" height="36" rx="3" fill="#5a3820" />
        <rect x="38" y="112" width="16" height="36" rx="3" fill="#4a2f18" />
        <rect x="16" y="142" width="20" height="12" rx="3" fill="#2a1a0f" />
        <rect x="36" y="142" width="20" height="12" rx="3" fill="#2a1a0f" />
        {/* body / vest */}
        <rect x="10" y="62" width="52" height="54" rx="10" fill="#466b3e" />
        <rect x="24" y="62" width="24" height="54" fill="#e6cd97" opacity="0.9" />
        <rect x="10" y="94" width="52" height="8" fill="#2a1a0f" opacity="0.7" />
        {/* arms */}
        <rect x="0" y="66" width="16" height="34" rx="8" fill="#466b3e" />
        <rect x="56" y="66" width="16" height="34" rx="8" fill="#466b3e" />
        <circle cx="8" cy="100" r="8" fill="#f0c896" />
        <circle cx="64" cy="102" r="8" fill="#f0c896" />
        {/* head */}
        <circle cx="36" cy="38" r="26" fill="#f0c896" />
        {/* beard */}
        <path d="M18 44 Q36 66 54 44 L54 52 Q36 62 18 52 Z" fill="#d8d8d8" />
        {/* hat */}
        <path d="M6 30 Q36 -6 66 30 Q36 20 6 30Z" fill="#5a3820" />
        <rect x="2" y="26" width="68" height="9" rx="4" fill="#3b2415" />
        {/* glasses */}
        <circle cx="26" cy="36" r="7" fill="none" stroke="#2a1a0f" strokeWidth="2.5" />
        <circle cx="46" cy="36" r="7" fill="none" stroke="#2a1a0f" strokeWidth="2.5" />
        <rect x="33" y="35" width="6" height="2.5" fill="#2a1a0f" />
      </g>

      {/* --- Mother (right) --- */}
      <g transform="translate(108,30)">
        {/* legs */}
        <rect x="18" y="118" width="16" height="24" rx="3" fill="#6b4b63" />
        <rect x="34" y="118" width="16" height="24" rx="3" fill="#5c3f55" />
        <rect x="16" y="138" width="20" height="12" rx="3" fill="#2a1a0f" />
        <rect x="34" y="138" width="20" height="12" rx="3" fill="#2a1a0f" />
        {/* dress */}
        <path d="M8 62 Q34 50 60 62 L66 122 Q34 134 2 122 Z" fill="#8677c2" />
        <path d="M20 62 L28 62 L26 100 L20 100 Z" fill="#f5e2a3" opacity="0.7" />
        <rect x="4" y="88" width="60" height="7" fill="#6b58a0" opacity="0.8" />
        {/* arms */}
        <rect x="-2" y="64" width="15" height="32" rx="7" fill="#8677c2" />
        <rect x="55" y="64" width="15" height="32" rx="7" fill="#8677c2" />
        <circle cx="5" cy="96" r="7.5" fill="#f6d3a8" />
        <circle cx="62" cy="98" r="7.5" fill="#f6d3a8" />
        {/* little basket */}
        <rect x="54" y="94" width="16" height="12" rx="3" fill="#7a4f2c" />
        <path d="M56 94 Q62 84 68 94" fill="none" stroke="#5a3820" strokeWidth="3" />
        {/* head */}
        <circle cx="34" cy="38" r="25" fill="#f6d3a8" />
        {/* hair */}
        <path d="M10 36 Q10 8 34 8 Q58 8 58 36 Q58 20 34 20 Q10 20 10 36Z" fill="#5a4030" />
        <path d="M12 34 Q10 54 18 62 L22 58 Q14 46 16 34Z" fill="#5a4030" />
        <path d="M56 34 Q58 54 50 62 L46 58 Q54 46 52 34Z" fill="#5a4030" />
        {/* hat */}
        <ellipse cx="34" cy="14" rx="34" ry="8" fill="#7c2c1f" />
        <path d="M14 14 Q34 -10 54 14 Q34 4 14 14Z" fill="#a8402f" />
        <circle cx="34" cy="5" r="4" fill="#d9b356" />
        {/* eyes closed happy */}
        <path d="M24 38 Q27 41 30 38" stroke="#2a1a0f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M38 38 Q41 41 44 38" stroke="#2a1a0f" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
