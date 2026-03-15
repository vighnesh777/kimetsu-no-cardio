import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, firebaseSignOut, resolveRedirectResult } from '../services/firebase';

const TOKEN_KEY = 'ds_gtoken';
const TOKEN_EXPIRY_KEY = 'ds_gtoken_exp';
// Google OAuth tokens live for 3600 s — we treat them as expired 5 min early to be safe
const TOKEN_TTL_MS = 55 * 60 * 1000;

function loadStoredToken() {
  const token  = localStorage.getItem(TOKEN_KEY);
  const expiry = parseInt(localStorage.getItem(TOKEN_EXPIRY_KEY) || '0', 10);
  if (token && Date.now() < expiry) return token;
  // Expired or missing — clear both keys
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  return null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [accessToken, setAccessToken] = useState(() => loadStoredToken());
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    // Handle redirect sign-in result (popup was blocked, Firebase redirected)
    resolveRedirectResult().then(result => {
      if (result?.accessToken) saveToken(result.accessToken);
    });

    // Keep user in sync with Firebase auth state
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // If Firebase signed the user out, also clear the API token
      if (!firebaseUser) clearToken();
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveToken = (token) => {
    setAccessToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS));
  };

  const clearToken = () => {
    setAccessToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  };

  const logout = async () => {
    await firebaseSignOut();
    setUser(null);
    clearToken();
  };

  // Expose whether the Google API token is still valid
  const isApiConnected = !!accessToken;

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, isApiConnected, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
