import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (nis: string, password: string) => { success: boolean; message?: string };
  quickLoginAs: (role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isGuruOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem('pemangan_users_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse users", e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pemangan_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse current user", e);
      }
    }
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem('pemangan_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pemangan_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pemangan_current_user');
    }
  }, [currentUser]);

  const login = (nis: string, password: string) => {
    const cleanNis = nis.trim();
    const found = users.find(u => u.nis.toLowerCase() === cleanNis.toLowerCase());
    
    if (!found) {
      return { success: false, message: 'NIS / NIP / Username tidak terdaftar dalam sistem.' };
    }
    
    if (found.password && found.password !== password.trim()) {
      return { success: false, message: 'Kata sandi salah. Silakan coba kembali.' };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const quickLoginAs = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;
  const isGuruOrAdmin = currentUser?.role === 'guru' || currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        quickLoginAs,
        logout,
        isAuthenticated,
        isGuruOrAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
