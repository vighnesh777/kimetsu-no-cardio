import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import DSIcon from '../DSIcon/DSIcon';
import { useAvatar } from '../../contexts/AvatarContext';
import AvatarSelector, { AvatarImage } from '../AvatarSelector/AvatarSelector';
import { useHunterImages } from '../AvatarSelector/useHunterImages';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: 'dashboard', label: 'Dashboard'    },
  { to: '/workouts',     icon: 'training',  label: 'Training'     },
  { to: '/stats',        icon: 'stats',     label: 'Stats'        },
  { to: '/missions',     icon: 'wisteria',  label: 'Missions'     },
  { to: '/achievements', icon: 'scroll',    label: 'Achievements' },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const { avatar } = useAvatar();
  const { imageForId, isLoading } = useHunterImages();
  const navigate = useNavigate();
  const [showAvatar,   setShowAvatar]   = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const navAvatarImg     = avatar ? imageForId(avatar.id) : null;
  const navAvatarLoading = avatar ? isLoading(avatar.id)  : false;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo */}
        <NavLink to="/dashboard" className={styles.logo}>
          <span className={styles.logoText}>Kimetsu no Cardio</span>
        </NavLink>

        {/* Nav links */}
        <div className={styles.links}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <motion.div className={styles.linkInner} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DSIcon name={item.icon} size={15} />
                <span className={styles.linkLabel}>{item.label}</span>
              </motion.div>
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className={styles.userArea}>
          <div className={styles.userMenuWrap} ref={menuRef}>
            {/* Hunter avatar — single button for both menu + character picker */}
            <motion.button
              className={styles.avatarBtn}
              onClick={() => setShowUserMenu(v => !v)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title={avatar ? avatar.name : 'Choose your hunter'}
            >
              <AvatarImage
                hunter={avatar}
                imageUrl={navAvatarImg}
                loading={navAvatarLoading}
                size={34}
              />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {avatar && (
                    <p className={styles.dropdownName}>{avatar.name}</p>
                  )}
                  {user && (
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  )}
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { setShowUserMenu(false); setShowAvatar(true); }}
                  >
                    <DSIcon name="user" size={14} />
                    Change Hunter
                  </button>
                  {user ? (
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <DSIcon name="signOut" size={14} />
                      Sign Out
                    </button>
                  ) : (
                    <button className={styles.dropdownItem} onClick={() => { setShowUserMenu(false); navigate('/onboarding'); }}>
                      <DSIcon name="google" size={14} />
                      Connect Google
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Character / avatar picker modal */}
      <AnimatePresence>
        {showAvatar && <AvatarSelector onClose={() => setShowAvatar(false)} />}
      </AnimatePresence>
    </>
  );
}
