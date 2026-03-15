import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHevyKey, saveHevyKey, clearHevyKey, validateHevyKey, getLastSyncTime } from '../../services/hevy';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './HevyConnect.module.css';

export default function HevyConnect({ onSynced }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';

  const [key,       setKey]       = useState('');
  const [connected, setConnected] = useState(!!getHevyKey());
  const [busy,      setBusy]      = useState(false);
  const [error,     setError]     = useState(null);
  const [showInput, setShowInput] = useState(false);

  const lastSync = getLastSyncTime();
  const lastSyncLabel = lastSync
    ? new Date(lastSync).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  const handleConnect = async () => {
    if (!key.trim()) return;
    setBusy(true);
    setError(null);
    const valid = await validateHevyKey(key.trim());
    if (!valid) {
      setError('Invalid API key. Find it in Hevy → Profile → API Key.');
      setBusy(false);
      return;
    }
    saveHevyKey(key.trim());
    setConnected(true);
    setShowInput(false);
    setKey('');
    setBusy(false);
    onSynced?.();
  };

  const handleDisconnect = () => {
    clearHevyKey();
    setConnected(false);
    setShowInput(false);
    setKey('');
    setError(null);
  };

  return (
    <div className={styles.wrap}>
      {connected ? (
        <div className={styles.connected}>
          <div className={styles.connectedLeft}>
            <span className={styles.dot} style={{ background: primary }} />
            <div>
              <p className={styles.connectedLabel}>Hevy Connected</p>
              {lastSyncLabel && (
                <p className={styles.lastSync}>Last sync: {lastSyncLabel}</p>
              )}
            </div>
          </div>
          <div className={styles.connectedActions}>
            <button
              className={styles.syncBtn}
              style={{ color: primary, borderColor: primary }}
              onClick={onSynced}
              disabled={busy}
            >
              {busy ? 'Syncing…' : 'Sync Now'}
            </button>
            <button className={styles.disconnectBtn} onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.disconnected}>
          <div className={styles.disconnectedInfo}>
            <p className={styles.disconnectedTitle}>Connect Hevy</p>
            <p className={styles.disconnectedSub}>
              Auto-sync workouts from Hevy to update your muscle map and training log.
            </p>
          </div>

          {!showInput ? (
            <button
              className={styles.connectBtn}
              style={{ background: primary }}
              onClick={() => setShowInput(true)}
            >
              Connect Hevy App
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                className={styles.inputWrap}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className={styles.keyHint}>
                  Get your API key: <strong>Hevy app → Profile → API Key</strong>
                </p>
                <div className={styles.inputRow}>
                  <input
                    className={styles.keyInput}
                    type="password"
                    placeholder="Paste your Hevy API key…"
                    value={key}
                    onChange={e => { setKey(e.target.value); setError(null); }}
                    onKeyDown={e => e.key === 'Enter' && handleConnect()}
                    autoFocus
                  />
                  <button
                    className={styles.confirmBtn}
                    style={{ background: primary }}
                    onClick={handleConnect}
                    disabled={busy || !key.trim()}
                  >
                    {busy ? '…' : 'Save'}
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => { setShowInput(false); setKey(''); setError(null); }}
                  >
                    Cancel
                  </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
