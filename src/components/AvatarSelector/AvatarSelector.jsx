import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAvatar } from '../../contexts/AvatarContext';
import { HUNTERS } from './hunters';
import { useHunterImages } from './useHunterImages';
import DSIcon from '../DSIcon/DSIcon';
import styles from './AvatarSelector.module.css';

// Re-export useAvatar from context so callers don't change imports
export { useAvatar } from '../../contexts/AvatarContext';

// ── Avatar image component ────────────────────────────────────
export function AvatarImage({ hunter, imageUrl, size = 40, loading = false, className = '' }) {
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return (
      <span
        className={`${styles.avatarShimmer} ${className}`}
        style={{ width: size, height: size, borderRadius: '50%' }}
      />
    );
  }

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={hunter?.name || 'Hunter'}
        className={`${styles.avatarImg} ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      className={`${styles.avatarFallback} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        borderColor: hunter ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
        background: hunter ? 'var(--card-gradient)' : 'rgba(255,255,255,0.05)',
      }}
    >
      {hunter ? hunter.name.charAt(0) : <DSIcon name="user" size={size * 0.5} />}
    </span>
  );
}

// ── Main selector modal ───────────────────────────────────────
export default function AvatarSelector({ onClose, onSelect }) {
  const { theme, styleId, selectStyle } = useTheme();
  const { avatarId, selectAvatar } = useAvatar();
  const { imageForId, isLoading } = useHunterImages();

  const [hoveredId,    setHoveredId]    = useState(null);
  const [selectedId,   setSelectedId]   = useState(avatarId);
  // Warning state: holds the hunter the user clicked before confirming
  const [pendingHunter, setPendingHunter] = useState(null);

  const primary = theme?.colors.primary || '#FF4500';

  const hoveredHunter = hoveredId ? HUNTERS.find(h => h.id === hoveredId) : null;
  const hoveredImg    = hoveredId ? imageForId(hoveredId) : null;

  const applyHunter = (hunter) => {
    setSelectedId(hunter.id);
    selectAvatar(hunter.id);
    selectStyle(hunter.breathingStyleId);
    onSelect?.(hunter);
    setPendingHunter(null);
  };

  const handleSelect = (hunter) => {
    // If breathing style is changing, show a warning first
    const styleChanging = styleId && hunter.breathingStyleId !== styleId;
    if (styleChanging) {
      setPendingHunter(hunter);   // show confirmation dialog
    } else {
      applyHunter(hunter);
    }
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Choose Your Hunter</h2>
            <p className={styles.subtitle}>Your character determines your Breathing Style</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <DSIcon name="close" size={16} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.previewPane}>
            <AnimatePresence mode="wait">
              {hoveredHunter ? (
                <motion.div
                  key={hoveredHunter.id}
                  className={styles.preview}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <AvatarImage
                    hunter={hoveredHunter}
                    imageUrl={hoveredImg}
                    loading={isLoading(hoveredHunter.id)}
                    size={120}
                    className={styles.previewAvatar}
                  />
                  <p className={styles.previewName}>{hoveredHunter.name}</p>
                  <p className={styles.previewRank} style={{ color: primary }}>
                    {hoveredHunter.rank}
                  </p>
                  <div className={styles.previewStyle}>
                    <DSIcon name="style" size={13} color={primary} />
                    <span>
                      {hoveredHunter.breathingStyleId.charAt(0).toUpperCase()
                        + hoveredHunter.breathingStyleId.slice(1)} Breathing
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className={styles.previewEmpty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DSIcon name="user" size={40} color="rgba(255,255,255,0.1)" />
                  <p>Hover to preview</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.grid}>
            {HUNTERS.map((hunter) => {
              const isSelected = selectedId === hunter.id;
              return (
                <motion.button
                  key={hunter.id}
                  className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                  style={isSelected ? { borderColor: primary, boxShadow: `0 0 14px ${primary}55` } : {}}
                  onMouseEnter={() => setHoveredId(hunter.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSelect(hunter)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AvatarImage
                    hunter={hunter}
                    imageUrl={imageForId(hunter.id)}
                    loading={isLoading(hunter.id)}
                    size={58}
                  />
                  <span className={styles.cardName}>{hunter.name.split(' ')[0]}</span>
                  <span className={styles.cardStyle}>{hunter.breathingStyleId}</span>

                  {isSelected && (
                    <motion.span
                      className={styles.checkBadge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <DSIcon name="check" size={9} color="#000" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          {selectedId && (
            <p className={styles.footerHint}>
              <DSIcon name="style" size={13} color={primary} />
              <span style={{ color: primary }}>
                {HUNTERS.find(h => h.id === selectedId)?.breathingStyleId.charAt(0).toUpperCase()
                  + HUNTERS.find(h => h.id === selectedId)?.breathingStyleId.slice(1)} Breathing
              </span>
              {' '}will be applied automatically
            </p>
          )}
          <motion.button
            className={styles.confirmBtn}
            onClick={onClose}
            disabled={!selectedId}
            whileHover={{ scale: selectedId ? 1.02 : 1 }}
            whileTap={{ scale: selectedId ? 0.98 : 1 }}
          >
            {selectedId ? 'Confirm Hunter' : 'Select a Hunter'}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Breathing style change warning ───────────────────── */}
      <AnimatePresence>
        {pendingHunter && (
          <motion.div
            className={styles.warningOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={styles.warningBox}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <p className={styles.warningTitle}>Change Breathing Style?</p>
              <p className={styles.warningBody}>
                Switching to <strong style={{ color: primary }}>{pendingHunter.name}</strong> will
                change your Breathing Style from{' '}
                <strong>{styleId?.charAt(0).toUpperCase() + styleId?.slice(1)} Breathing</strong> to{' '}
                <strong style={{ color: primary }}>
                  {pendingHunter.breathingStyleId.charAt(0).toUpperCase()
                    + pendingHunter.breathingStyleId.slice(1)} Breathing
                </strong>.
              </p>
              <p className={styles.warningNote}>
                Your form progression and training history are preserved — only the theme changes.
              </p>
              <div className={styles.warningActions}>
                <button
                  className={styles.warningCancel}
                  onClick={() => setPendingHunter(null)}
                >
                  Keep Current Style
                </button>
                <button
                  className={styles.warningConfirm}
                  style={{ background: primary }}
                  onClick={() => applyHunter(pendingHunter)}
                >
                  Switch Style
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
