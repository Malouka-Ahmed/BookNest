import { useCallback, useEffect, useState } from 'react';
import AuthContext from './authContext';
import * as authService from '../services/authService';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => authService.isLoggedIn());
  const [sessionError, setSessionError] = useState('');

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSessionError('');
  }, []);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setSessionError('');
    if (!authService.isLoggedIn()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setUser(await authService.getMe());
    } catch (error) {
      if (error.status === 401 || error.status === 404) {
        logout();
      } else {
        setSessionError('Unable to verify your session. Check the server and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    let active = true;
    if (!authService.isLoggedIn()) return () => {
      active = false;
    };

    authService.getMe()
      .then((authenticatedUser) => {
        if (active) setUser(authenticatedUser);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 404) {
          authService.logout();
          setUser(null);
        } else {
          setSessionError('Unable to verify your session. Check the server and try again.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    setSessionError('');
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (details) => {
    const authenticatedUser = await authService.register(details);
    setSessionError('');
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const updateUser = (updates) => {
    setUser((currentUser) => (currentUser ? { ...currentUser, ...updates } : currentUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, sessionError, login, register, logout, refreshSession, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
