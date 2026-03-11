import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ParticleCanvas.module.css';

function createParticle(canvas, colors, type) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = Math.random() * 3 + 1;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const speedX = (Math.random() - 0.5) * 1.5;
  let speedY;
  let life = Math.random();
  let opacity = Math.random() * 0.6 + 0.1;

  switch (type) {
    case 'fire':
      speedY = -(Math.random() * 2 + 0.5);
      break;
    case 'water':
      speedY = Math.random() * 1 + 0.2;
      break;
    case 'wind':
      speedY = (Math.random() - 0.5) * 1;
      break;
    case 'lightning':
      speedY = (Math.random() - 0.5) * 3;
      break;
    case 'divine':
      speedY = -(Math.random() * 1.5 + 0.5);
      break;
    default:
      speedY = (Math.random() - 0.5) * 1.5;
  }

  return { x, y: type === 'fire' || type === 'divine' ? canvas.height * Math.random() : y, size, color, speedX, speedY, life, opacity, type };
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const type = theme.particleType;
    const colors = theme.colors.particle;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 60;
    let particles = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas, colors, type)
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life += 0.005;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.life * 2));

        if (type === 'lightning' && Math.random() < 0.02) {
          // lightning bolt flash
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha * 0.8;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (Math.random() - 0.5) * 20, p.y + 20);
          ctx.stroke();
        } else if (type === 'butterfly' || type === 'petals' || type === 'hearts') {
          ctx.globalAlpha = alpha;
          ctx.font = `${p.size * 5}px serif`;
          const emoji = type === 'butterfly' ? '🦋' : type === 'petals' ? '🌸' : '❤️';
          ctx.fillText(emoji, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;

          // glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
