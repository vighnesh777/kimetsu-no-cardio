import { createContext, useContext, useState, useCallback } from 'react';
import { HUNTERS } from '../components/AvatarSelector/hunters';

const AvatarContext = createContext(null);

export function AvatarProvider({ children }) {
  const [avatarId, setAvatarId] = useState(
    () => localStorage.getItem('ds_avatar') || null
  );

  const avatar = HUNTERS.find(h => h.id === avatarId) || null;

  const selectAvatar = useCallback((id) => {
    setAvatarId(id);
    localStorage.setItem('ds_avatar', id);
  }, []);

  return (
    <AvatarContext.Provider value={{ avatar, avatarId, selectAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export const useAvatar = () => useContext(AvatarContext);
