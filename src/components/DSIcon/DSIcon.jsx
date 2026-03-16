/**
 * DSIcon — Demon Slayer-inspired SVG icon library.
 * No emoji. All hand-crafted SVG paths.
 *
 * Usage: <DSIcon name="katana" size={20} color="currentColor" />
 */

const icons = {
  // ── Navigation ──────────────────────────────────────────────
  katana: (
    // Nichirin sword — horizontal, anatomically accurate to Demon Slayer
    // Blade curves slightly upward (sori), tsuba is circular, tsuka has diamond wrap
    <svg viewBox="0 0 96 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* === BLADE === */}
      {/* Spine (mune) — thicker top edge */}
      <path d="M2 11.5 Q30 10.5 58 11 L64 12" stroke="currentColor" strokeWidth="2.2"/>
      {/* Edge (ha) — razor-thin bottom, tapers to tip */}
      <path d="M2 12.5 Q30 12 58 11.5 L64 12" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
      {/* Fuller groove (hi) — blood groove running along blade */}
      <path d="M8 11.8 Q35 11.2 55 11.6" stroke="currentColor" strokeWidth="0.5" opacity="0.35" strokeDasharray="2 1.5"/>
      {/* Blade tip (kissaki) — triangular point */}
      <path d="M58 11 L66 11.5 L58 12" fill="currentColor" opacity="0.9"/>
      {/* Blade glow / reflection line */}
      <path d="M12 11.3 Q38 10.8 52 11.1" stroke="currentColor" strokeWidth="0.4" opacity="0.22"/>

      {/* === TSUBA (circular guard) === */}
      {/* Outer ring */}
      <circle cx="69" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      {/* Inner decoration — four-petal pattern (kiku/chrysanthemum motif) */}
      <circle cx="69" cy="12" r="2.2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7"/>
      <line x1="69" y1="7" x2="69" y2="17" stroke="currentColor" strokeWidth="0.7" opacity="0.45"/>
      <line x1="64" y1="12" x2="74" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.45"/>

      {/* === TSUKA (handle) with diamond cord wrap === */}
      {/* Handle body */}
      <rect x="75" y="9.5" width="17" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      {/* Diamond wrap (hishigami) — alternating crosses */}
      <line x1="77" y1="9.5" x2="79" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <line x1="79" y1="9.5" x2="77" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <line x1="81" y1="9.5" x2="83" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <line x1="83" y1="9.5" x2="81" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <line x1="85" y1="9.5" x2="87" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      <line x1="87" y1="9.5" x2="85" y2="14.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
      {/* Kashira (pommel cap) */}
      <ellipse cx="93" cy="12" rx="2.5" ry="3.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
      <ellipse cx="93" cy="12" rx="1.2" ry="1.8" fill="currentColor" opacity="0.4"/>
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

  // ── Gamification & Stats icons (DS-themed) ───────────────────

  // Kasugai Crow — anime-style, clean Japanese illustration
  crow: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <ellipse cx="12" cy="14" rx="5.5" ry="4.5" fill="currentColor" opacity="0.15"
        stroke="currentColor" strokeWidth="1.5"/>
      {/* Head */}
      <circle cx="12" cy="8.5" r="3.2" fill="currentColor" opacity="0.15"
        stroke="currentColor" strokeWidth="1.5"/>
      {/* Beak */}
      <path d="M12 8 L14.2 9.2 L12 10.2Z" fill="currentColor"/>
      {/* Left wing outstretched */}
      <path d="M6.5 13 Q3 11 2 8 Q5 9.5 6.5 13Z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.2"/>
      {/* Right wing outstretched */}
      <path d="M17.5 13 Q21 11 22 8 Q19 9.5 17.5 13Z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.2"/>
      {/* Eye */}
      <circle cx="13.2" cy="8" r="0.9" fill="currentColor"/>
      {/* Legs */}
      <line x1="10.5" y1="18.5" x2="9.5" y2="21.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="13.5" y1="18.5" x2="14.5" y2="21.5" stroke="currentColor" strokeWidth="1.3"/>
      {/* Talons */}
      <line x1="9.5" y1="21.5" x2="8" y2="22" stroke="currentColor" strokeWidth="1.1"/>
      <line x1="9.5" y1="21.5" x2="10.5" y2="22.5" stroke="currentColor" strokeWidth="1.1"/>
      <line x1="14.5" y1="21.5" x2="16" y2="22" stroke="currentColor" strokeWidth="1.1"/>
      <line x1="14.5" y1="21.5" x2="13.5" y2="22.5" stroke="currentColor" strokeWidth="1.1"/>
      {/* Mission scroll tied to leg */}
      <rect x="8" y="19.5" width="3.5" height="2.2" rx="0.5" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
    </svg>
  ),

  // Mission scroll — traditional Japanese emaki/makimono
  scroll: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Scroll body */}
      <rect x="4" y="5" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      {/* Top roller */}
      <ellipse cx="12" cy="5" rx="8" ry="1.8" stroke="currentColor" strokeWidth="1.4"/>
      {/* Bottom roller */}
      <ellipse cx="12" cy="19" rx="8" ry="1.8" stroke="currentColor" strokeWidth="1.4"/>
      {/* Text lines (kanji-style) */}
      <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
      <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
      {/* Seal dot */}
      <circle cx="15" cy="15" r="1.2" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  ),

  // Geta (traditional wooden sandal) — for steps
  steps: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Sandal platform (thick wooden base) */}
      <rect x="3" y="11" width="18" height="4" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      {/* Two wooden teeth/supports underneath */}
      <rect x="6" y="15" width="3" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="15" y="15" width="3" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.3"/>
      {/* Thong strap (hanao) */}
      <path d="M9 11 Q12 7 15 11" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <line x1="12" y1="7.5" x2="12" y2="11" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),

  // Hibachi/brazier — fire in a clay bowl, for calories
  flame: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Clay bowl */}
      <path d="M5 17 Q6 21 12 21 Q18 21 19 17 Z" stroke="currentColor" strokeWidth="1.5"/>
      {/* Bowl rim */}
      <ellipse cx="12" cy="17" rx="7" ry="2" stroke="currentColor" strokeWidth="1.4"/>
      {/* Central flame */}
      <path d="M12 15 Q10 12 12 9 Q14 12 12 15Z" stroke="currentColor" strokeWidth="1.4"/>
      {/* Left flame */}
      <path d="M9.5 15 Q8 12.5 9.5 10.5 Q11 13 9.5 15Z" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
      {/* Right flame */}
      <path d="M14.5 15 Q16 12.5 14.5 10.5 Q13 13 14.5 15Z" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
    </svg>
  ),

  // Mountain path — for distance
  distance: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Mountain peaks */}
      <path d="M2 20 L8 8 L14 20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 20 L16 10 L22 20" stroke="currentColor" strokeWidth="1.5"/>
      {/* Winding path at base */}
      <path d="M2 20 Q7 18 12 20 Q17 22 22 20" stroke="currentColor" strokeWidth="1.3" opacity="0.7"/>
    </svg>
  ),

  // Heartbeat with brush-stroke waves — for heart rate
  heartRate: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Flat line left */}
      <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.7"/>
      {/* Spike up */}
      <polyline points="6,12 8,5 10,17 12,9 14,15 16,12" stroke="currentColor" strokeWidth="1.7"/>
      {/* Flat line right */}
      <line x1="16" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  ),

  // Crescent moon with wave clouds — for sleep
  sleep: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Crescent moon */}
      <path d="M21 12.5 A9 9 0 1 1 12 3 A7 7 0 0 0 21 12.5Z"
        stroke="currentColor" strokeWidth="1.6"/>
      {/* Stars */}
      <line x1="19" y1="6" x2="19" y2="8" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="18" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="21" y1="14" x2="21" y2="15.5" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="20.25" y1="14.75" x2="21.75" y2="14.75" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),

  // Sword slash — dynamic Nichirin slash mark, for active minutes
  activeMinutes: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Main slash arc */}
      <path d="M4 20 Q8 14 12 12 Q16 10 20 4" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Speed lines */}
      <line x1="3" y1="15" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      <line x1="5" y1="19" x2="9" y2="17" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      {/* Blade glint at tip */}
      <circle cx="20" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      {/* Impact marks */}
      <line x1="16" y1="18" x2="18" y2="21" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      <line x1="19" y1="16" x2="22" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  ),

  // Rising sun with rays — for best day / highlights
  risSun: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
      {/* Horizon line */}
      <line x1="2" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5"/>
      {/* Rays above horizon */}
      <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="19" y1="6" x2="17.2" y2="7.8" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="5" y1="6" x2="6.8" y2="7.8" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="22" y1="13" x2="19" y2="13" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="2" y1="13" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),

  // Abacus / balance — for averages
  average: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Frame */}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      {/* Horizontal rails */}
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.3"/>
      {/* Beads on top rail */}
      <circle cx="7" cy="9" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      {/* Beads on middle rail */}
      <circle cx="9" cy="15" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <circle cx="17" cy="15" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    </svg>
  ),

  // Breath mark — circular breathing form, for style/breathing
  breath: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6"/>
      {/* Petals/form lines */}
      <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="3" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5.6" y1="5.6" x2="8.4" y2="8.4" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="15.6" y1="15.6" x2="18.4" y2="18.4" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="18.4" y1="5.6" x2="15.6" y2="8.4" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="8.4" y1="15.6" x2="5.6" y2="18.4" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),

  // Corps mark / wisteria seal — for achievements/rank
  corpsSeal: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      {/* 6-pointed star (Ougon Kami pattern) */}
      <polygon points="12,3 13.8,8.6 19.7,8.6 14.9,12 16.7,17.6 12,14.2 7.3,17.6 9.1,12 4.3,8.6 10.2,8.6"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
    </svg>
  ),

  // Wisteria flower — for missions / achievements category
  wisteria: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="6" x2="8" y2="9" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="12" y1="6" x2="16" y2="9" stroke="currentColor" strokeWidth="1.3"/>
      {/* Flower clusters */}
      <circle cx="7" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="17" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="9" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="15" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="12" cy="21" r="2" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),

  // Crossed swords — for strength workout
  swords: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="1.7"/>
      <line x1="21" y1="21" x2="3" y2="3" stroke="currentColor" strokeWidth="1.7"/>
      {/* Guards */}
      <line x1="7.5" y1="7.5" x2="4.5" y2="4.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      <line x1="16.5" y1="16.5" x2="19.5" y2="19.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      <ellipse cx="6" cy="18" rx="2.5" ry="1.2" transform="rotate(-45 6 18)"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
      <ellipse cx="18" cy="6" rx="2.5" ry="1.2" transform="rotate(-45 18 6)"
        stroke="currentColor" strokeWidth="1.3" fill="none"/>
    </svg>
  ),

  // Spinning tornado / wind — for cardio/active
  windSpiral: (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12 Q18 8 20 4 Q22 2 20 2 Q16 2 14 6 Q12 10 12 12Z"
        stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12 Q6 16 4 20 Q2 22 4 22 Q8 22 10 18 Q12 14 12 12Z"
        stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12 Q16 16 20 18 Q22 20 21 21 Q19 22 16 20 Q13 17 12 12Z"
        stroke="currentColor" strokeWidth="1.3" opacity="0.7"/>
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

// Icons with non-square viewBoxes — width is derived from height × aspect ratio
const WIDE_ICONS = { katana: 96 / 24 }; // viewBox width/height

export default function DSIcon({ name, size = 20, color = 'currentColor', className = '', style = {} }) {
  const icon = icons[name];
  if (!icon) return null;

  const aspect = WIDE_ICONS[name] || 1;
  const w = size * aspect;
  const h = size;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: w,
        height: h,
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
