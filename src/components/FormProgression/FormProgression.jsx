import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getOrdinal } from '../../data/breathingForms';
import styles from './FormProgression.module.css';

const ORDINAL_KANJI = ['壱','弐','参','肆','伍','陸','漆','捌','玖','拾',
  '拾壱','拾弐','拾参','拾肆','拾伍','拾陸'];

export default function FormProgression({ forms = [], unlockedForms = 0, totalForms = 0 }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const primary = theme?.colors.primary || '#FF4500';

  if (!forms.length) return null;

  const currentForm = forms[unlockedForms - 1] || forms[0];
  const nextForm    = forms[unlockedForms] || null;
  const progress    = totalForms > 0 ? (unlockedForms / totalForms) * 100 : 0;

  return (
    <motion.div className={styles.wrap} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.styleName}>{theme?.name}</span>
          <span className={styles.styleJp}>{theme?.japanese}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.formCount} style={{ color: primary }}>{unlockedForms} / {totalForms} Forms</span>
          <button className={styles.expandBtn} onClick={() => setExpanded(v => !v)} style={{ color: primary }}>
            {expanded ? 'Collapse' : 'View All'}
          </button>
        </div>
      </div>

      {currentForm && (
        <motion.div className={styles.currentForm} style={{ borderColor: primary, background: `${primary}10` }}>
          <div className={styles.currentFormLeft}>
            <span className={styles.formOrdinalKanji} style={{ color: primary }}>
              {ORDINAL_KANJI[(currentForm.number || 1) - 1] || currentForm.number}ノ型
            </span>
            <span className={styles.formEnglish}>{currentForm.english}</span>
            <span className={styles.formJapanese}>{currentForm.japanese}</span>
          </div>
          <div className={styles.currentBadge} style={{ background: primary }}>
            <span>Current</span>
          </div>
        </motion.div>
      )}

      {nextForm && (
        <div className={styles.nextFormRow}>
          <span className={styles.nextLabel}>Next: {nextForm.english}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%`, background: primary }} />
          </div>
          <span className={styles.nextCount} style={{ color: primary }}>{unlockedForms * 5} / {(unlockedForms + 1) * 5} workouts</span>
        </div>
      )}

      {!nextForm && (
        <p className={styles.masteredMsg} style={{ color: primary }}>All forms mastered. Complete mastery of {theme?.name} achieved.</p>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div className={styles.formList} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            {forms.map((form, i) => {
              const unlocked  = i < unlockedForms;
              const isCurrent = i === unlockedForms - 1;
              return (
                <motion.button
                  key={form.number}
                  className={`${styles.formRow} ${unlocked ? styles.unlocked : styles.locked} ${isCurrent ? styles.isCurrent : ''}`}
                  style={isCurrent ? { borderColor: primary } : {}}
                  onClick={() => setSelected(selected?.number === form.number ? null : form)}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                >
                  <span className={styles.rowOrdinal} style={{ color: unlocked ? primary : undefined }}>
                    {ORDINAL_KANJI[i] || i + 1}ノ型
                  </span>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowEnglish}>{unlocked ? form.english : `${getOrdinal(form.number)} Form — Locked`}</span>
                    {unlocked && <span className={styles.rowJapanese}>{form.japanese}</span>}
                  </div>
                  {unlocked
                    ? <span className={styles.unlockedDot} style={{ background: primary }} />
                    : <span className={styles.lockedIcon}>鍵</span>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && selected.number <= unlockedForms && (
          <motion.div className={styles.formDetail} style={{ borderColor: primary, background: `${primary}0A` }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <span className={styles.detailOrdinal} style={{ color: primary }}>
              {ORDINAL_KANJI[(selected.number || 1) - 1] || selected.number}ノ型
            </span>
            <span className={styles.detailEnglish}>{selected.english}</span>
            <span className={styles.detailJapanese}>{selected.japanese}</span>
            <button className={styles.detailClose} onClick={() => setSelected(null)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
