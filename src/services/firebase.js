import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDjDLleV-enzXVCiJFkxVNLL-1IWCG-Bw0",
  authDomain: "kimetsu-no-cardio.firebaseapp.com",
  projectId: "kimetsu-no-cardio",
  storageBucket: "kimetsu-no-cardio.firebasestorage.app",
  messagingSenderId: "821617002493",
  appId: "1:821617002493:web:3f810b48a0b0b5cd63bb94",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
[
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
  'https://www.googleapis.com/auth/spreadsheets',
].forEach(s => provider.addScope(s));
provider.setCustomParameters({ prompt: 'select_account' });

export { auth };
export const IS_CONFIGURED = true;

/**
 * Sign in with Google.
 * Tries popup first; falls back to redirect if popup is blocked.
 * Returns { user, accessToken } on success.
 */
export async function signInWithGoogle() {
  try {
    const result     = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return { user: result.user, accessToken: credential.accessToken };
  } catch (err) {
    // Popup blocked — fall back to redirect (browser will return to the app)
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider);
      return null; // page will redirect; result handled in AuthContext on load
    }
    throw err;
  }
}

/**
 * Call once on app load to capture the result of a redirect sign-in.
 * Returns { user, accessToken } or null if no redirect pending.
 */
export async function resolveRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return { user: result.user, accessToken: credential.accessToken };
  } catch {
    return null;
  }
}

export async function firebaseSignOut() {
  await signOut(auth);
}

export { onAuthStateChanged };
