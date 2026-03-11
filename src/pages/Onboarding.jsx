import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { HUNTERS } from '../components/AvatarSelector/hunters';
import { useHunterImages } from '../components/AvatarSelector/useHunterImages';
import { useAvatar, AvatarImage } from '../components/AvatarSelector/AvatarSelector';
import GoogleAuth from '../components/GoogleAuth/GoogleAuth';
import DSIcon from '../components/DSIcon/DSIcon';
import { getStyle } from '../themes/breathingStyles';
import styles from './Onboarding.module.css';

// ── Step 1: Welcome ───────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <motion.div
      key="welcome"
      className={styles.center}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className={styles.logoGlyph}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <DSIcon name="katana" size={76} color="var(--color-primary, #FF4500)" />
      </motion.div>

      <h1 className={styles.title}>
        <span className={styles.titleMain}>Kimetsu no Cardio</span>
        <span className={styles.titleSub}>鬼滅の有酸素運動</span>
      </h1>

      <p className={styles.tagline}>
        Train like a Demon Slayer. Track every step, every breath.
      </p>

      <motion.button
        className={styles.primaryBtn}
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        Begin Your Journey
      </motion.button>
    </motion.div>
  );
}

// ── Step 2: Pick your Hunter (sets style automatically) ───────
function PickHunterStep({ onSelect, onBack }) {
  const { imageForId, isLoading } = useHunterImages();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const hoveredHunter = hovered ? HUNTERS.find(h => h.id === hovered) : null;
  const hoveredStyle  = hoveredHunter ? getStyle(hoveredHunter.breathingStyleId) : null;

  const handlePick = (hunter) => {
    setSelected(hunter.id);
    setTimeout(() => onSelect(hunter), 480);
  };

  return (
    <motion.div
      key="pick"
      className={styles.pickerWrap}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -36 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.pickerHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <DSIcon name="arrowLeft" size={16} />
        </button>
        <div>
          <h2 className={styles.pickerTitle}>Choose Your Hunter</h2>
          <p className={styles.pickerSub}>
            Your Breathing Style is assigned automatically by your character
          </p>
        </div>
      </div>

      <AnimatePresence>
        {hoveredHunter && (
          <motion.div
            className={styles.hoverBanner}
            style={{
              borderColor: hoveredStyle?.colors.primary,
              background: hoveredStyle?.cardGradient,
              boxShadow: hoveredStyle?.borderGlow,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <AvatarImage
              hunter={hoveredHunter}
              imageUrl={imageForId(hoveredHunter.id)}
              loading={isLoading(hoveredHunter.id)}
              size={46}
            />
            <div>
              <p className={styles.hoverName}>{hoveredHunter.name}</p>
              <p className={styles.hoverStyle} style={{ color: hoveredStyle?.colors.primary }}>
                {hoveredHunter.breathingStyleId.charAt(0).toUpperCase() + hoveredHunter.breathingStyleId.slice(1)} Breathing
                {' · '}{hoveredHunter.rank}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.hunterGrid}>
        {HUNTERS.map((hunter, i) => {
          const imgUrl  = imageForId(hunter.id);
          const loading = isLoading(hunter.id);
          const isPicked = selected === hunter.id;
          const hStyle  = getStyle(hunter.breathingStyleId);

          return (
            <motion.button
              key={hunter.id}
              className={`${styles.hunterCard} ${isPicked ? styles.hunterCardPicked : ''}`}
              style={isPicked ? {
                borderColor: hStyle.colors.primary,
                boxShadow: hStyle.borderGlow,
                background: hStyle.cardGradient,
              } : {}}
              onMouseEnter={() => setHovered(hunter.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handlePick(hunter)}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.93 }}
            >
              <AvatarImage
                hunter={hunter}
                imageUrl={imgUrl}
                loading={loading}
                size={66}
                className={styles.hunterCardImg}
              />
              <span className={styles.hunterCardName}>
                {hunter.name.split(' ')[0]}
              </span>
              <span className={styles.hunterCardBreath} style={{ color: hStyle.colors.primary }}>
                {hunter.breathingStyleId}
              </span>

              {isPicked && (
                <motion.div
                  className={styles.pickedOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DSIcon name="check" size={22} color="#000" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Step 3: Google Auth ───────────────────────────────────────
function AuthStep({ hunter, theme, onSuccess, onBack, onSkip }) {
  const { imageForId, isLoading } = useHunterImages();

  return (
    <motion.div
      key="auth"
      className={styles.center}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -36 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.chosenDisplay}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AvatarImage
          hunter={hunter}
          imageUrl={imageForId(hunter.id)}
          loading={isLoading(hunter.id)}
          size={96}
          className={styles.chosenAvatar}
        />
        <div className={styles.chosenInfo}>
          <p className={styles.chosenName}>{hunter.name}</p>
          <p className={styles.chosenRank} style={{ color: theme?.colors.primary }}>
            {hunter.rank}
          </p>
          <p className={styles.chosenBreathing}>
            <DSIcon name="style" size={12} color={theme?.colors.primary} />
            {' '}{theme?.name}
          </p>
          <p className={styles.chosenQuote}>"{theme?.quote}"</p>
        </div>
      </motion.div>

      <p className={styles.authDesc}>
        Sync with Google to pull your fitness data from Google Fit
        and log every training session to Google Sheets automatically.
      </p>

      <div className={styles.authButtons}>
        <GoogleAuth onSuccess={onSuccess} />
        <button className={styles.skipBtn} onClick={onSkip}>
          Continue without Google
        </button>
      </div>

      <button className={styles.textBackBtn} onClick={onBack}>
        <DSIcon name="arrowLeft" size={13} />
        Change Hunter
      </button>
    </motion.div>
  );
}

// ── Root Onboarding ───────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep]               = useState('welcome');
  const [pickedHunter, setPickedHunter] = useState(null);

  const { selectStyle, theme } = useTheme();
  const { selectAvatar }       = useAvatar();
  const navigate               = useNavigate();

  const handlePickHunter = (hunter) => {
    setPickedHunter(hunter);
    selectAvatar(hunter.id);
    selectStyle(hunter.breathingStyleId);
    setStep('auth');
  };

  return (
    <div className={styles.page} style={{ background: theme?.colors.bg || '#0A0A0A' }}>
      {/* Ambient kanji */}
      <div className={styles.kanjiWall}>
        {['滅', '鬼', '呼', '吸', '刀', '剣', '士', '柱', '炎', '水', '風', '雷', '岩', '霞', '蟲', '花', '音', '日', '月', '恋', '蛇', '獣'].map((k, i) => (
          <span
            key={i}
            className={styles.kanji}
            style={{
              animationDelay: `${i * 0.3}s`,
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 13 + 8) % 85}%`,
              color: theme?.colors.primary || '#FF4500',
            }}
          >
            {k}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeStep onNext={() => setStep('pick')} />}

        {step === 'pick' && (
          <PickHunterStep
            onSelect={handlePickHunter}
            onBack={() => setStep('welcome')}
          />
        )}

        {step === 'auth' && pickedHunter && (
          <AuthStep
            hunter={pickedHunter}
            theme={theme}
            onSuccess={() => navigate('/dashboard')}
            onBack={() => setStep('pick')}
            onSkip={() => navigate('/dashboard')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
