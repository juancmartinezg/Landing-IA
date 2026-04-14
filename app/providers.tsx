'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
interface User {
  email: string;
  name: string;
  sub: string;
  accessToken: string;
  companyId: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithGoogle: () => void;
  loginWithEmail: () => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  loginWithGoogle: () => {},
  loginWithEmail: () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);
const COGNITO_DOMAIN = 'https://us-east-1kijdadxdl.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '4r4jhvvutib915k449sr67kuce';
const REDIRECT_URI = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://clientes.bot/auth/callback'
  : 'http://localhost:3000/auth/callback';
export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      const stored = localStorage.getItem('cb_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.companyId) {
            setUser(parsed);
            setLoading(false);
            return;
          }
          // Si no tiene companyId, buscarlo en /me
          if (parsed.email) {
            try {
              const res = await fetch(`${API_URL}/me?email=${encodeURIComponent(parsed.email)}`);
              if (res.ok) {
                const data = await res.json();
                parsed.companyId = data.company_id || '';
              } else {
                parsed.companyId = '';
              }
            } catch {
              parsed.companyId = '';
            }
            localStorage.setItem('cb_user', JSON.stringify(parsed));
          }
          setUser(parsed);
        } catch {}
      }
      setLoading(false);
    };
    checkUser();
  }, []);
  const loginWithGoogle = () => {
    const url = `${COGNITO_DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&identity_provider=Google`;
    window.location.href = url;
  };
  const loginWithEmail = () => {
    const url = `${COGNITO_DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = url;
  };
  const login = loginWithGoogle;
  const logout = () => {
    localStorage.removeItem('cb_user');
    localStorage.removeItem('cb_tokens');
    setUser(null);
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(window.location.origin)}`;
    window.location.href = logoutUrl;
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}