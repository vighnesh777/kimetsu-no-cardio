import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './InfinityCastle.module.css';

/**
 * InfinityCastle background.
 *
 * Priority:
 *   1. If the user has placed an image at /infinity-castle.jpg (or .png / .webp)
 *      in the public folder, it is used as the background with:
 *        - slow Ken Burns zoom-pan animation
 *        - dark cinematic overlay tinted in the breathing style colour
 *        - particle canvas overlay for atmosphere
 *   2. If no image is found, falls back to the procedural corridor animation.
 *
 * To use your own image:
 *   Copy any HD Infinity Castle image to  public/infinity-castle.jpg
 *   (also accepts .png or .webp — try each extension in order)
 */

// import.meta.env.BASE_URL is '/' locally and '/kimetsu-no-cardio/' on GitHub Pages
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // strip trailing slash

const IMAGE_CANDIDATES = [
  `${BASE}/infinity-castle.jpg`,
  `${BASE}/infinity-castle.png`,
  `${BASE}/infinity-castle.webp`,
];

function tryLoadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function findAvailableImage() {
  for (const src of IMAGE_CANDIDATES) {
    const result = await tryLoadImage(src);
    if (result) return result;
  }
  return null;
}

// ── Procedural fallback (corridor perspective) ───────────────────────────────
function ProceduralCastle({ theme }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const hex  = (theme?.colors.primary || '#6B21A8').replace('#', '');
    const r    = parseInt(hex.slice(0, 2), 16) || 107;
    const g    = parseInt(hex.slice(2, 4), 16) || 33;
    const b    = parseInt(hex.slice(4, 6), 16) || 168;
    const rgba = (a) => `rgba(${r},${g},${b},${a})`;

    const CANDLES = Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2, dist: 0.06 + Math.random() * 0.36,
      flicker: Math.random() * Math.PI * 2, speed: 0.8 + Math.random() * 1.5, size: 1 + Math.random() * 1.5,
    }));

    let t = 0;

    const drawCorridor = (cx, cy, spanW, spanH, depth, angle, baseAlpha) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      const m = Math.min(canvas.width, canvas.height);
      for (let i = 0; i < depth; i++) {
        const frac = i / depth, scale = 1 - frac * 0.93;
        const w = m * spanW * scale, h = m * spanH * scale;
        const alpha = baseAlpha * (1 - frac * 0.75);
        ctx.strokeStyle = rgba(alpha); ctx.lineWidth = 0.9 - frac * 0.5;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        if (i % 3 === 0) {
          ctx.globalAlpha = alpha * 0.35;
          ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        if (i % 5 === 0) {
          ctx.globalAlpha = alpha * 0.45;
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h / 2);
          ctx.quadraticCurveTo(-w / 4, -h / 2 - h * 0.22, 0, -h / 2 - h * 0.16);
          ctx.quadraticCurveTo(w / 4, -h / 2 - h * 0.22, w / 2, -h / 2);
          ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
      const ow = m * spanW, oh = m * spanH;
      [[-ow/2,-oh/2],[ow/2,-oh/2],[ow/2,oh/2],[-ow/2,oh/2]].forEach(([x,y]) => {
        ctx.strokeStyle = rgba(baseAlpha * 0.3); ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(0,0); ctx.stroke();
      });
      ctx.restore();
    };

    const draw = () => {
      t += 0.004;
      ctx.fillStyle = 'rgba(4,2,14,0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height, cx = W/2, cy = H/2;
      drawCorridor(cx, cy, 0.72, 0.56, 30, t * 0.12, 0.45);
      drawCorridor(cx, cy, 0.56, 0.72, 22, -t * 0.09 + Math.PI/4, 0.28);
      drawCorridor(cx + Math.sin(t*0.3)*W*0.04, cy + Math.cos(t*0.2)*H*0.04, 0.4, 0.44, 16, t*0.2 + Math.PI/6, 0.2);
      const vg = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.12);
      vg.addColorStop(0, rgba(0.5+0.2*Math.sin(t*2.5)));
      vg.addColorStop(0.5, rgba(0.1)); vg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);
      CANDLES.forEach(c => {
        const ang = c.angle+t*0.08, dist = c.dist*Math.min(W,H);
        const px = cx+Math.cos(ang)*dist, py = cy+Math.sin(ang)*dist;
        const f = 0.5+0.5*Math.sin(t*c.speed+c.flicker);
        const g2 = ctx.createRadialGradient(px,py,0,px,py,c.size*6);
        g2.addColorStop(0,`rgba(255,220,140,${0.7*f})`);
        g2.addColorStop(0.4,`rgba(255,160,60,${0.15*f})`);
        g2.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(px,py,c.size*6,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(255,240,180,${0.9*f})`; ctx.beginPath(); ctx.arc(px,py,c.size*0.9,0,Math.PI*2); ctx.fill();
      });
      const vig = ctx.createRadialGradient(cx,cy,Math.min(W,H)*0.2,cx,cy,Math.max(W,H)*0.9);
      vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);
      animRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = 'rgb(4,2,14)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

// ── Image-based version ──────────────────────────────────────────────────────
function ImageCastle({ src, theme }) {
  const primary = theme?.colors.primary || '#6B21A8';

  // Extract rgb from hex for the tint overlay
  const hex = primary.replace('#', '');
  const r   = parseInt(hex.slice(0, 2), 16) || 107;
  const g   = parseInt(hex.slice(2, 4), 16) || 33;
  const b   = parseInt(hex.slice(4, 6), 16) || 168;

  return (
    <div className={styles.imageCastle}>
      {/* The actual Infinity Castle image — slow Ken Burns zoom+pan */}
      <div
        className={styles.imageLayer}
        style={{ backgroundImage: `url(${src})` }}
      />
      {/* Dark base overlay — ensures readability */}
      <div className={styles.darkOverlay} />
      {/* Colour tint from breathing style */}
      <div
        className={styles.tintOverlay}
        style={{ background: `rgba(${r},${g},${b},0.18)` }}
      />
      {/* Bottom-to-top dark gradient (text readable above this) */}
      <div className={styles.bottomFade} />
      {/* Candle-light shimmer canvas overlay */}
      <ParticleOverlay theme={theme} />
    </div>
  );
}

// ── Lightweight particle overlay (candles only, no corridor drawing) ─────────
function ParticleOverlay({ theme }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLES = Array.from({ length: 35 }, () => ({
      x: Math.random(), y: Math.random(),
      vy: -(0.00015 + Math.random() * 0.0003),
      flicker: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      size: 0.8 + Math.random() * 1.4,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      PARTICLES.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(t * 0.4 + p.flicker) * 0.0001;
        if (p.y < -0.02) { p.y = 1.05; p.x = Math.random(); }
        const px = p.x * W, py = p.y * H;
        const alpha = (0.3 + 0.4 * Math.sin(t * p.speed + p.flicker)) * 0.55;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5);
        g.addColorStop(0, `rgba(255,230,140,${alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, p.size * 5, 0, Math.PI * 2); ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

// ── Root component ───────────────────────────────────────────────────────────
export default function InfinityCastle() {
  const { theme }     = useTheme();
  const [imgSrc, setImgSrc] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    findAvailableImage().then(setImgSrc);
  }, []);

  if (imgSrc === undefined) return null; // waiting for probe

  if (imgSrc) return <ImageCastle src={imgSrc} theme={theme} />;
  return <ProceduralCastle theme={theme} />;
}
