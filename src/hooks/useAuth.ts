import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Points strictly to AuthContext

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be mounted inside an explicit AuthProvider wrapper');
  }
  return context;
};
