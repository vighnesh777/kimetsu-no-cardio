import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatar } from '../../contexts/AvatarContext';
import { useHunterImages } from '../AvatarSelector/useHunterImages';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './CharacterBackground.module.css';

export default function CharacterBackground() {
  const { avatar } = useAvatar();
  const { largeImageForId } = useHunterImages();
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const large = avatar ? largeImageForId(avatar.id) : null;

  // Reset loaded state when character changes
  useEffect(() => {
    setLoaded(false);
    setImgSrc(large);
  }, [large]);

  if (!avatar || !imgSrc) return null;

  const primary   = theme?.colors.primary   || '#FF4500';
  const glow      = theme?.colors.glow      || 'rgba(255,69,0,0.4)';
  const bg        = theme?.colors.bg        || '#0D0500';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={avatar.id}
        className={styles.wrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
        aria-hidden="true"
      >
        {/* The character image */}
        <motion.img
          src={imgSrc}
          alt=""
          className={styles.img}
          onLoad={() => setLoaded(true)}
          onError={() => setImgSrc(null)}
          animate={{
            y:      [0, -14, 0],
            filter: [
              `drop-shadow(0 0 30px ${glow}) drop-shadow(0 0 60px ${glow})`,
              `drop-shadow(0 0 50px ${glow}) drop-shadow(0 0 100px ${glow})`,
              `drop-shadow(0 0 30px ${glow}) drop-shadow(0 0 60px ${glow})`,
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Vertical colour beam behind character */}
        <div
          className={styles.beam}
          style={{ background: `linear-gradient(to top, transparent, ${primary}18, ${primary}30, ${primary}18, transparent)` }}
        />

        {/* Wide gradient — covers left half solidly, feathers into right */}
        <div
          className={styles.fadeLeft}
          style={{ background: `linear-gradient(to right, ${bg} 0%, ${bg} 30%, ${bg}EE 42%, ${bg}AA 55%, ${bg}44 68%, transparent 85%)` }}
        />

        {/* Gradient that fades the bottom into the page bg */}
        <div
          className={styles.fadeBottom}
          style={{ background: `linear-gradient(to top, ${bg} 0%, ${bg}BB 12%, transparent 40%)` }}
        />

        {/* Character name watermark */}
        <motion.p
          className={styles.name}
          style={{ color: primary }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: loaded ? 0.35 : 0, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {avatar.name}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
