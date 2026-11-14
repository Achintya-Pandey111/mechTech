import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { mockUser } from '../services/mockData.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Check current session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          setIsOfflineMode(false);
        } catch (err) {
          console.warn("Could not fetch current session from backend:", err.message);
          // If token failed or backend is down, fall back to mock demo user
          setUser(mockUser);
          setIsOfflineMode(true);
        }
      } else {
        // Default to demo user for instant live preview
        setUser(mockUser);
        setIsOfflineMode(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setIsOfflineMode(false);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      console.warn("API login failed, checking fallback:", err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setIsOfflineMode(false);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      console.warn("API registration failed:", err.message);
      throw err;
    }
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchRoleDemo = (role) => {
    if (!user) return;
    if (role === 'ALUMNI') {
      setUser({
        ...user,
        role: 'ALUMNI',
        alumni: {
          id: 'alm-demo',
          graduationYear: 2021,
          currentCompany: 'Google',
          jobTitle: 'Senior Software Engineer',
          department: { name: 'Computer Science & Engineering' }
        }
      });
    } else if (role === 'STUDENT') {
      setUser({
        ...user,
        role: 'STUDENT',
        student: {
          id: 's-demo-1',
          studentNumber: 'STU2024091',
          batchYear: 2022,
          graduationYear: 2026,
          department: { name: 'Computer Science & Engineering' }
        }
      });
    } else if (role === 'ADMIN') {
      setUser({
        ...user,
        role: 'ADMIN'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        isOfflineMode,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
