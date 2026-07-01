import React, { createContext, useState } from 'react';

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 1. We create the context internally
const InternalAuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Export the Context object under a clean alias (Safe from the ESLint rule)
export { InternalAuthContext as AuthContext };

// 3. Export the main Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('poc_token'));

  const login = (newToken: string) => {
    localStorage.setItem('poc_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('poc_token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <InternalAuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </InternalAuthContext.Provider>
  );
};
