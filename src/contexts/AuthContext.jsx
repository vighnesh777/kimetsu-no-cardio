import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, firebaseSignOut, IS_CONFIGURED } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Restore Google access token from this browser session
    const savedToken = sessionStorage.getItem('ds_gtoken');
    if (savedToken) setAccessToken(savedToken);

    if (!IS_CONFIGURED || !auth) {
      // Firebase not configured yet — app still works in demo mode
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveToken = (token) => {
    setAccessToken(token);
    sessionStorage.setItem('ds_gtoken', token);
  };

  const logout = async () => {
    await firebaseSignOut();
    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem('ds_gtoken');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, saveToken, logout, isConfigured: IS_CONFIGURED }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
