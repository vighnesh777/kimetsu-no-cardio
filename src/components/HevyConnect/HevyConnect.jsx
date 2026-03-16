import { motion } from 'framer-motion';
import { getHevyKey, getLastSyncTime, clearSyncedIds } from '../../services/hevy';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './HevyConnect.module.css';

export default function HevyConnect({ onSynced, syncing }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';
  const connected = !!getHevyKey();

  const lastSync = getLastSyncTime();
  const lastSyncLabel = lastSync
    ? new Date(lastSync).toLocaleString('en', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Never';

  const handleFullSync = () => {
    clearSyncedIds();   // wipe the cache so ALL historical workouts are fetched
    onSynced(false);    // trigger sync with toast
  };

  if (!connected) {
    return (
      <div className={styles.wrap}>
        <div className={styles.row}>
          <span className={styles.dotOff} />
          <p className={styles.label}>Hevy not configured</p>
          <p className={styles.hint}>Add <code>VITE_HEVY_API_KEY</code> to <code>.env.local</code> and redeploy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.dot} style={{ background: primary }} />
        <div>
          <p className={styles.label}>Hevy Connected</p>
          <p className={styles.lastSync}>Last sync: {lastSyncLabel}</p>
        </div>
        <div className={styles.actions}>
          <motion.button
            className={styles.syncBtn}
            style={{ color: primary, borderColor: primary }}
            onClick={() => onSynced(false)}
            disabled={syncing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {syncing ? 'Syncing…' : 'Sync Now'}
          </motion.button>
          <motion.button
            className={styles.fullSyncBtn}
            onClick={handleFullSync}
            disabled={syncing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Clears sync cache and re-fetches all Hevy history"
          >
            Full Sync
          </motion.button>
        </div>
      </div>
    </div>
  );
}
