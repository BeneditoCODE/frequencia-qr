import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler, tokenStore } from '../services/api';
import { authApi } from '../services/endpoints';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!tokenStore.get());

  const logout = useCallback(() => { tokenStore.clear(); setUser(null); }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (tokenStore.get()) authApi.me().then(setUser).catch(logout).finally(() => setLoading(false));
  }, [logout]);

  const value = useMemo(() => {
    const autenticar = async request => {
      const { token, usuario } = await request;
      tokenStore.set(token);
      setUser(usuario);
      return usuario;
    };
    return {
      user, loading, logout,
      atualizarPerfil: async dados => { const atualizado = await authApi.updateProfile(dados); setUser(atualizado); return atualizado; },
      login: dados => autenticar(authApi.login(dados)),
      register: dados => autenticar(authApi.register(dados)),
    };
  }, [user, loading, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
