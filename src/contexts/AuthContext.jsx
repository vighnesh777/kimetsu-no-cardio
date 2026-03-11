import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, firebaseSignOut, resolveRedirectResult } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Restore Google access token saved in sessionStorage
    const savedToken = sessionStorage.getItem('ds_gtoken');
    if (savedToken) setAccessToken(savedToken);

    // Handle redirect sign-in result (when popup was blocked)
    resolveRedirectResult().then(result => {
      if (result) {
        setUser(result.user);
        saveToken(result.accessToken);
      }
    });

    // Stay in sync with Firebase auth state
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
    <AuthContext.Provider value={{ user, accessToken, loading, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
