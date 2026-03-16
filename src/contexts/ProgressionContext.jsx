import { createContext, useContext } from 'react';
import { useProgression } from '../hooks/useProgression';

const ProgressionContext = createContext(null);

// Single provider wrapping the whole app — one fetch, one state, no race conditions
export function ProgressionProvider({ children }) {
  const progression = useProgression();
  return (
    <ProgressionContext.Provider value={progression}>
      {children}
    </ProgressionContext.Provider>
  );
}

// All components use this instead of useProgression() directly
export function useProgressionContext() {
  return useContext(ProgressionContext);
}
