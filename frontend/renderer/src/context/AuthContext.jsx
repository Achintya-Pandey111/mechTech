import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Check current session on mount with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
          } else {
            api.setToken(null);
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.warn("Session expired or invalid token:", err.message);
          api.setToken(null);
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
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
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      console.warn("API login failed:", err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
