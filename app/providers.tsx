'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const COGNITO_REGION = 'us-east-1';
const COGNITO_CLIENT_ID = '4r4jhvvutib915k449sr67kuce';
interface User {
  email: string;
  name: string;
  sub: string;
  accessToken: string;
  companyId: string;
  role: string;
  agentId: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithGoogle: () => void;
  loginWithEmail: () => void;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ok: boolean, needsConfirm?: boolean, error?: string}>;
  signInWithEmail: (email: string, password: string) => Promise<{ok: boolean, error?: string}>;
  confirmSignUp: (email: string, code: string) => Promise<{ok: boolean, error?: string}>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  loginWithGoogle: () => {},
  loginWithEmail: () => {},
  signUpWithEmail: async () => ({ok: false}),
  signInWithEmail: async () => ({ok: false}),
  confirmSignUp: async () => ({ok: false}),
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
                parsed.role = data.role || 'owner';
                parsed.agentId = data.agent_id || '';
              } else {
                parsed.companyId = '';
                parsed.role = '';
                parsed.agentId = '';
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
  const cognitoFetch = async (action: string, body: any) => {
    const res = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-amz-json-1.1', 'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.__type) throw new Error(data.message || data.__type);
    return data;
  };
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      await cognitoFetch('SignUp', {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email }, { Name: 'name', Value: name }],
      });
      return { ok: true, needsConfirm: true };
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.includes('UsernameExistsException') || msg.includes('already exists')) return { ok: false, error: 'Este email ya está registrado. Inicia sesión.' };
      if (msg.includes('InvalidPasswordException') || msg.includes('Password')) return { ok: false, error: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.' };
      return { ok: false, error: msg || 'Error al registrar' };
    }
  };
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const data = await cognitoFetch('InitiateAuth', {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      });
      if (data.AuthenticationResult) {
        const idToken = data.AuthenticationResult.IdToken;
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        let companyId = '', role = 'owner', agentId = '';
        try {
          const meRes = await fetch(`${API_URL}/me?email=${encodeURIComponent(email)}`);
          if (meRes.ok) {
            const meData = await meRes.json();
            companyId = meData.company_id || '';
            role = meData.role || 'owner';
            agentId = meData.agent_id || '';
          }
        } catch {}
        const userData = { email, name: payload.name || payload.email || '', sub: payload.sub || '', accessToken: data.AuthenticationResult.AccessToken || '', companyId, role, agentId };
        localStorage.setItem('cb_user', JSON.stringify(userData));
        localStorage.setItem('cb_tokens', JSON.stringify({ id_token: idToken, access_token: data.AuthenticationResult.AccessToken, refresh_token: data.AuthenticationResult.RefreshToken }));
        setUser(userData);
        return { ok: true };
      }
      return { ok: false, error: 'Error de autenticación' };
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.includes('NotAuthorizedException')) return { ok: false, error: 'Email o contraseña incorrectos.' };
      if (msg.includes('UserNotConfirmedException')) return { ok: false, error: 'Confirma tu email primero. Revisa tu bandeja de entrada.' };
      if (msg.includes('UserNotFoundException')) return { ok: false, error: 'No existe una cuenta con este email.' };
      return { ok: false, error: msg || 'Error al iniciar sesión' };
    }
  };
  const confirmSignUp = async (email: string, code: string) => {
    try {
      await cognitoFetch('ConfirmSignUp', { ClientId: COGNITO_CLIENT_ID, Username: email, ConfirmationCode: code });
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e.message || 'Código inválido' };
    }
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
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, loginWithEmail, signUpWithEmail, signInWithEmail, confirmSignUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}