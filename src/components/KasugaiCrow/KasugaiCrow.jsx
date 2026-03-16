import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * KasugaiCrow — large, detailed SVG crow in the Demon Slayer anime style.
 * Inspired by Japanese Edo-period bird illustrations (kachōga).
 * Flat fills, bold ink outlines, expressive silhouette.
 */
export default function KasugaiCrow({ size = 120, animate = true }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';
  const glow    = theme?.colors.glow    || 'rgba(255,69,0,0.6)';

  const content = (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 10px ${glow})`, overflow: 'visible' }}
    >
      {/* ── Left wing (outstretched, feathered) ── */}
      <g>
        {/* Wing body */}
        <path
          d="M22 58 Q10 48 4 34 Q12 38 20 45 Q10 30 8 14 Q18 22 24 38 Q16 22 20 8 Q28 20 28 40 Q24 26 32 18 Q34 32 30 50 L22 58Z"
          fill="#111" stroke="#000" strokeWidth="1"/>
        {/* Primary feathers */}
        <path d="M22 58 Q6 55 2 48 Q10 50 22 58Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
        <path d="M22 58 Q8 62 4 56 Q12 57 22 58Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
        {/* Wing highlight */}
        <path d="M24 40 Q20 35 22 28" stroke="#333" strokeWidth="1" fill="none"/>
      </g>

      {/* ── Right wing (outstretched, feathered) ── */}
      <g>
        <path
          d="M98 58 Q110 48 116 34 Q108 38 100 45 Q110 30 112 14 Q102 22 96 38 Q104 22 100 8 Q92 20 92 40 Q96 26 88 18 Q86 32 90 50 L98 58Z"
          fill="#111" stroke="#000" strokeWidth="1"/>
        <path d="M98 58 Q114 55 118 48 Q110 50 98 58Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
        <path d="M98 58 Q112 62 116 56 Q108 57 98 58Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
        <path d="M96 40 Q100 35 98 28" stroke="#333" strokeWidth="1" fill="none"/>
      </g>

      {/* ── Body ── */}
      <ellipse cx="60" cy="72" rx="22" ry="18" fill="#111" stroke="#000" strokeWidth="1.5"/>

      {/* ── Tail feathers ── */}
      <path d="M45 86 Q52 100 60 104 Q68 100 75 86" fill="#111" stroke="#000" strokeWidth="1.2"/>
      <path d="M50 88 Q56 100 60 104" stroke="#333" strokeWidth="0.8" fill="none"/>
      <path d="M70 88 Q64 100 60 104" stroke="#333" strokeWidth="0.8" fill="none"/>

      {/* ── Head ── */}
      <circle cx="60" cy="50" r="16" fill="#111" stroke="#000" strokeWidth="1.5"/>

      {/* ── Beak ── */}
      <path d="M68 50 L78 46 L74 53 Z" fill="#2a2a2a" stroke="#000" strokeWidth="1"/>
      {/* Beak highlight */}
      <line x1="70" y1="48" x2="76" y2="46" stroke="#444" strokeWidth="0.8"/>

      {/* ── Eye ── */}
      <circle cx="65" cy="46" r="5" fill="#fff"/>
      <circle cx="66" cy="47" r="3.5" fill="#222"/>
      <circle cx="65" cy="45.5" r="1.5" fill="#000"/>
      {/* Eye highlight */}
      <circle cx="64" cy="45" r="1" fill="#fff"/>

      {/* ── Neck collar feathers ── */}
      <path d="M46 58 Q48 64 60 68 Q72 64 74 58 Q68 62 60 63 Q52 62 46 58Z"
        fill="#111" stroke="#000" strokeWidth="0.8"/>

      {/* ── Feet / talons ── */}
      <line x1="52" y1="88" x2="48" y2="102" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="88" x2="72" y2="102" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Left talons */}
      <line x1="48" y1="102" x2="42" y2="105" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="48" y1="102" x2="49" y2="108" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="48" y1="102" x2="55" y2="105" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      {/* Right talons */}
      <line x1="72" y1="102" x2="78" y2="105" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="72" y1="102" x2="71" y2="108" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="72" y1="102" x2="65" y2="105" stroke="#111" strokeWidth="2" strokeLinecap="round"/>

      {/* ── Mission scroll tied to left leg ── */}
      <rect x="40" y="96" width="14" height="9" rx="2"
        fill={primary} stroke="#000" strokeWidth="1" opacity="0.9"/>
      <line x1="47" y1="96" x2="47" y2="90" stroke="#000" strokeWidth="1"/>
      {/* Scroll kanji / lines */}
      <line x1="42" y1="99" x2="52" y2="99" stroke="#000" strokeWidth="0.8" opacity="0.6"/>
      <line x1="42" y1="102" x2="48" y2="102" stroke="#000" strokeWidth="0.8" opacity="0.6"/>

      {/* ── Feather detail on body ── */}
      <path d="M48 68 Q52 72 48 76" stroke="#333" strokeWidth="0.7" fill="none"/>
      <path d="M54 70 Q58 74 54 78" stroke="#333" strokeWidth="0.7" fill="none"/>
      <path d="M66 70 Q70 74 66 78" stroke="#333" strokeWidth="0.7" fill="none"/>

      {/* ── Crest feathers on head ── */}
      <path d="M56 36 Q58 28 60 24 Q62 28 64 36" stroke="#111" strokeWidth="1.5" fill="none"/>
      <path d="M60 24 Q58 18 60 14" stroke="#111" strokeWidth="1.2" fill="none"/>
    </svg>
  );

  if (!animate) return content;

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-flex' }}
    >
      {content}
    </motion.div>
  );
}
