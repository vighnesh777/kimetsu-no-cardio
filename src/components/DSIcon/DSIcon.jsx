/**
 * DSIcon — Demon Slayer-inspired SVG icon library.
 * No emoji. All hand-crafted SVG paths.
 *
 * Usage: <DSIcon name="katana" size={20} color="currentColor" />
 */

const icons = {
  // ── Navigation ──────────────────────────────────────────────
  katana: (
    // Nichirin sword — diagonal blade
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Blade */}
      <line x1="3" y1="21" x2="18" y2="6" stroke="currentColor" strokeWidth="1.8"/>
      {/* Tip */}
      <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="21" y1="3" x2="18" y2="6" stroke="currentColor" strokeWidth="1.8"/>
      {/* Guard (tsuba) */}
      <ellipse cx="7" cy="17" rx="2.5" ry="1.2" transform="rotate(-45 7 17)"
        stroke="currentColor" strokeWidth="1.5" fill="none"/>
      {/* Handle */}
      <line x1="4" y1="20" x2="2" y2="22" stroke="currentColor" strokeWidth="2.2"/>
    </svg>
  ),

  dashboard: (
    // Wisteria flower silhouette (protects against demons)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="18" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="6" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="16" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="8" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="12" y1="8.5" x2="12" y2="22" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),

  training: (
    // Crossed nichirin swords
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="21" y1="3" x2="3" y2="21" stroke="currentColor" strokeWidth="1.8"/>
      {/* left guard */}
      <ellipse cx="7.5" cy="7.5" rx="2" ry="1" transform="rotate(-45 7.5 7.5)"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
      {/* right guard */}
      <ellipse cx="16.5" cy="7.5" rx="2" ry="1" transform="rotate(45 16.5 7.5)"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
    </svg>
  ),

  stats: (
    // Rising bar chart with flame tip — performance / mastery
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Bars */}
      <rect x="3" y="14" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="9" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="17" y="5" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      {/* Flame tip on tallest bar */}
      <path d="M19 5 Q19 2 21 1 Q20 3.5 21 5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7"/>
    </svg>
  ),

  nichirin: (
    // Nichirin blade — the iconic Demon Slayer sword with curved blade, tsuba, and wrapped handle
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Blade — slightly curved single-edge */}
      <path d="M20 2 Q22 4 20 6 L7 17" stroke="currentColor" strokeWidth="1.8"/>
      {/* Blade edge detail */}
      <path d="M20 2 L18 4" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      {/* Tsuba (circular guard) */}
      <circle cx="8.5" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      {/* Handle wrapping lines */}
      <line x1="5.5" y1="18.5" x2="4.5" y2="19.5" stroke="currentColor" strokeWidth="2.2"/>
      <line x1="4.5" y1="19.5" x2="3.5" y2="20.5" stroke="currentColor" strokeWidth="2.2"/>
      <line x1="3.5" y1="20.5" x2="2.5" y2="21.5" stroke="currentColor" strokeWidth="2"/>
      {/* Handle wrap cross marks */}
      <line x1="4.2" y1="18.8" x2="5.8" y2="20.2" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
      <line x1="3.2" y1="19.8" x2="4.8" y2="21.2" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  ),

  style: (
    // Breathing spiral / whirl mark
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M12 12 m-0.5 0 a8 8 0 1 1 0.1 0" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 12 m-0.5 0 a5 5 0 1 1 0.1 0" stroke="currentColor" strokeWidth="1.4" opacity="0.7"/>
      <path d="M12 12 m-0.5 0 a2.5 2.5 0 1 1 0.1 0" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  ),

  // ── Stats ────────────────────────────────────────────────────
  steps: (
    // Sandal footprint (geta)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="7" height="9" rx="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="7" y1="9" x2="7" y2="7" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="10" y1="9" x2="10" y2="7" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="12" y="6" width="7" height="9" rx="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="14" y1="6" x2="14" y2="4" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="17" y1="6" x2="17" y2="4" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),

  flame: (
    // Flame breathing fire
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 C12 2 8 7 8 12 C8 16 10 18 12 19 C14 18 16 16 16 12 C16 8.5 14 6 14 4 C14 4 15 9 12 11 C10 9.5 12 2 12 2Z"
        stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M9 14 C9 17 10.5 19.5 12 20.5 C13.5 19.5 15 17 15 14"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
      <path d="M10.5 16 C10.5 18 11.2 19.5 12 20"
        stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6"/>
    </svg>
  ),

  distance: (
    // Map path / journey
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18 Q8 8 12 12 Q16 16 21 6" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="3" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="21" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    </svg>
  ),

  heartRate: (
    // Heartbeat waveform (pulse)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,12 6,12 8,6 10,18 13,8 15,14 17,12 22,12"
        stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  sleep: (
    // Crescent moon + stars (Demon Slayer fights at night)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="18" cy="6" r="0.8" fill="currentColor"/>
      <circle cx="20" cy="4" r="0.5" fill="currentColor"/>
      <circle cx="16" cy="3.5" r="0.5" fill="currentColor"/>
    </svg>
  ),

  activeMinutes: (
    // Lightning bolt (Thunder Breathing)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13,2 4,14 12,14 11,22 20,10 12,10 13,2"
        stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  calories: (
    // Flame in a circle (energy)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6 C12 6 9.5 9.5 9.5 12.5 C9.5 14.8 10.8 16.2 12 17 C13.2 16.2 14.5 14.8 14.5 12.5 C14.5 10 13 8 13 7 C13 7 13.5 10.5 12 11.5 C11 10.5 12 6 12 6Z"
        stroke="currentColor" strokeWidth="1.4" fill="none"/>
    </svg>
  ),

  // ── Actions ──────────────────────────────────────────────────
  plus: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  check: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2.2"/>
    </svg>
  ),

  close: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  sync: (
    // Two swords rotating (sync arrows)
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M23 20v-6h-6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3.51 15a9 9 0 0 0 14.85 3.36L23 14" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  signOut: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8"/>
      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  google: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),

  sheets: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="15" y1="9" x2="15" y2="21" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),

  // ── Breathing Style icons ─────────────────────────────────────
  water: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M12 2 C12 2 4 10 4 15 a8 8 0 0 0 16 0 C20 10 12 2 12 2Z"
        stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 17 Q12 14 15 17" stroke="currentColor" strokeWidth="1.3" opacity="0.6"/>
    </svg>
  ),

  wind: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M3 8 Q10 8 14 6 Q18 4 18 8 Q18 12 13 12 H3" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M3 14 Q8 14 11 12" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
      <path d="M3 18 Q9 18 13 16 Q17 14 17 18 Q17 21 14 21" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),

  thunder: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13,2 4,14 12,14 11,22 20,10 12,10 13,2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  // ── Misc ──────────────────────────────────────────────────────
  user: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),

  star: (
    // Hashira rank star
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  target: (
    // Goal / mission target
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),

  calendar: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  trophy: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 4H4a1 1 0 0 0-1 1v3c0 2.76 2.24 5 5 5h.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M17 4h3a1 1 0 0 1 1 1v3c0 2.76-2.24 5-5 5h-.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7 4h10v8a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  weight: (
    // Dumbbell
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="2" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="18" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

export default function DSIcon({ name, size = 20, color = 'currentColor', className = '', style = {} }) {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color,
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
    </span>
  );
}

export { icons };
