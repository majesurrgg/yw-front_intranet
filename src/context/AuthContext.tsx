import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import type { LoginResponse, LoginCredentials } from '../services/auth.service';

interface AuthContextType {
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await AuthService.login(credentials);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 