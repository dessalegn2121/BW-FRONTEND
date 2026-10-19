import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isAxiosError } from 'axios';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('bw_user') ?? 'null'); }
    catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bw_token'));
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('bw_token')));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authService.me()
      .then((currentUser) => {
        setUser(currentUser);
        localStorage.setItem('bw_user', JSON.stringify(currentUser));
      })
      .catch((error: unknown) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('bw_token');
          localStorage.removeItem('bw_user');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await authService.login(email, password);
      setToken(t); setUser(u);
      localStorage.setItem('bw_token', t);
      localStorage.setItem('bw_user', JSON.stringify(u));
      return u;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('bw_token');
    localStorage.removeItem('bw_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin: user?.role === 'admin', loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}