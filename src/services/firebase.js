import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

// ─────────────────────────────────────────────────────────────────
// SETUP (one time — paste your Firebase config here):
//
//  1. https://console.firebase.google.com → Create/open project
//  2. Project Settings → General → Add Web App → copy config
//  3. Authentication → Sign-in method → Enable "Google"
//  4. Authentication → Settings → Authorized domains → add "localhost"
//
//  Firebase config is NOT secret — safe to commit to code.
// ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const IS_CONFIGURED = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Only initialise Firebase once and only when config is filled in
let auth = null;
let provider = null;

if (IS_CONFIGURED) {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);

  provider = new GoogleAuthProvider();
  [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/spreadsheets',
  ].forEach(s => provider.addScope(s));
  provider.setCustomParameters({ prompt: 'select_account' });
}

export { auth, IS_CONFIGURED };

/**
 * Sign in with Google popup.
 * Returns { user, accessToken } — accessToken works with Fit & Sheets APIs.
 */
export async function signInWithGoogle() {
  if (!IS_CONFIGURED || !auth || !provider) {
    throw new Error('Firebase not configured. Fill in firebaseConfig in src/services/firebase.js');
  }
  const result     = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return { user: result.user, accessToken: credential.accessToken };
}

export async function firebaseSignOut() {
  if (auth) await signOut(auth);
}

export { onAuthStateChanged };
