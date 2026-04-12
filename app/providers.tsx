'use client';
import { createContext, useContext, useState, useEffect } from 'react';
interface User {
  email: string;
  name: string;
  sub: string;
  accessToken: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);
const COGNITO_DOMAIN = 'https://us-east-1kijdadxdl.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '4r4jhvvutib915k449sr67kuce';
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/auth/callback`
  : 'http://localhost:3000/auth/callback';
export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Verificar si hay sesion guardada
    const stored = localStorage.getItem('cb_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);
  const login = () => {
    const url = `${COGNITO_DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = url;
  };
  const logout = () => {
    localStorage.removeItem('cb_user');
    localStorage.removeItem('cb_tokens');
    setUser(null);
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(window.location.origin)}`;
    window.location.href = logoutUrl;
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}