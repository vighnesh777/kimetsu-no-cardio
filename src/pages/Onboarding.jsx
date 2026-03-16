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
import InfinityCastle from '../components/InfinityCastle/InfinityCastle';
import styles from './Onboarding.module.css';

// ── DS-style title logo SVG — 鬼滅の刃 with CARDIO replacing 刃 ────────────
function KimetsuNoCardioLogo({ primary, accent, glow }) {
  return (
    <svg
      viewBox="0 0 420 170"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'min(420px,92vw)', height: 'auto', filter: `drop-shadow(0 0 20px ${glow})` }}
      aria-label="Kimetsu no Cardio"
    >
      <defs>
        <linearGradient id="kncGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={accent} />
          <stop offset="50%"  stopColor={primary} />
          <stop offset="100%" stopColor={primary} stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="kncGradH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={primary} stopOpacity="0" />
          <stop offset="20%"  stopColor={primary} stopOpacity="0.9" />
          <stop offset="80%"  stopColor={primary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={primary} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer frame */}
      <rect x="6" y="6" width="408" height="158" rx="3" fill="rgba(0,0,0,0.45)" />

      {/* Decorative border lines — top & bottom */}
      <rect x="12" y="12"  width="396" height="1.5" fill="url(#kncGradH)" />
      <rect x="12" y="156" width="396" height="1.5" fill="url(#kncGradH)" />
      {/* left & right */}
      <rect x="12"  y="12" width="1.5" height="146" fill={primary} opacity="0.55" />
      <rect x="406" y="12" width="1.5" height="146" fill={primary} opacity="0.55" />

      {/* Corner ornaments */}
      {[[16,16],[404,16],[16,154],[404,154]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={primary} opacity="0.8"/>
      ))}

      {/* Thin horizontal rule mid-top */}
      <line x1="60" y1="30" x2="360" y2="30" stroke={primary} strokeWidth="0.6" opacity="0.4"/>
      {/* Thin horizontal rule mid-bottom */}
      <line x1="60" y1="140" x2="360" y2="140" stroke={primary} strokeWidth="0.6" opacity="0.4"/>

      {/* Main kanji row: 鬼滅の */}
      <text
        x="118" y="102"
        textAnchor="middle"
        fontFamily="'Noto Serif JP','Hiragino Mincho Pro','Yu Mincho',serif"
        fontSize="72"
        fontWeight="900"
        fill="url(#kncGrad)"
        letterSpacing="4"
        paintOrder="stroke"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="2"
      >鬼滅の</text>

      {/* "CARDIO" — replaces 刃 (Yaiba), in Permanent Marker matching DS English sub-title style */}
      <text
        x="320" y="98"
        textAnchor="middle"
        fontFamily="'Permanent Marker',cursive"
        fontSize="44"
        fontWeight="400"
        fill="url(#kncGrad)"
        paintOrder="stroke"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="1.5"
        letterSpacing="2"
      >CARDIO</text>

      {/* Divider between kanji and CARDIO */}
      <line x1="228" y1="42" x2="228" y2="118" stroke={primary} strokeWidth="0.8" opacity="0.45"/>

      {/* Sub-label */}
      <text
        x="210" y="128"
        textAnchor="middle"
        fontFamily="'Inter',sans-serif"
        fontSize="9.5"
        fill="rgba(255,255,255,0.38)"
        letterSpacing="5"
      >KIMETSU  NO  CARDIO</text>

      {/* Bottom Japanese tagline */}
      <text
        x="210" y="148"
        textAnchor="middle"
        fontFamily="'Noto Serif JP',serif"
        fontSize="9"
        fill={primary}
        opacity="0.55"
        letterSpacing="3"
      >鬼を滅するが如く鍛えよ</text>
    </svg>
  );
}

// ── Step 1: Welcome ───────────────────────────────────────────
function WelcomeStep({ onNext }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#C0392B';
  const accent  = theme?.colors.accent  || '#F5CBA7';
  const glow    = theme?.colors.glow    || 'rgba(192,57,43,0.7)';

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <KimetsuNoCardioLogo primary={primary} accent={accent} glow={glow} />
      </motion.div>

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
    <div className={styles.page} style={{ background: theme?.colors.bg || '#03010a' }}>
      {/* Infinity Castle background */}
      <InfinityCastle />

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
