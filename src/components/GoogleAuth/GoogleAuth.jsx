import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle, IS_CONFIGURED } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import DSIcon from '../DSIcon/DSIcon';
import styles from './GoogleAuth.module.css';

export default function GoogleAuth({ onSuccess }) {
  const { saveToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState(null);

  const handleLogin = async () => {
    if (!IS_CONFIGURED) {
      setErr('Add your Firebase config in src/services/firebase.js to enable Google sign-in.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const { accessToken } = await signInWithGoogle();
      saveToken(accessToken);
      onSuccess?.();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setErr('Sign-in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <motion.button
        className={styles.btn}
        onClick={handleLogin}
        disabled={busy}
        whileHover={{ scale: busy ? 1 : 1.03 }}
        whileTap={{ scale: busy ? 1 : 0.97 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {busy ? <span className={styles.spinner} /> : <DSIcon name="google" size={20} />}
        {busy ? 'Connecting…' : 'Connect Google Account'}
      </motion.button>

      {err && <p className={styles.error}>{err}</p>}
    </div>
  );
}
