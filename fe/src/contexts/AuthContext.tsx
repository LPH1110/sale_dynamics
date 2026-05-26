import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie, eraseCookie } from '@/utils/cookies';
import { UserDTO } from '@/types/user.types';
import * as authService from '@/services/auth.service';
import * as userService from '@/services/user.service';

interface AuthContextType {
  user: UserDTO | null;
  isLoading: boolean;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => void;
  updateUser: (updated: UserDTO) => void;
  showSessionExpired: boolean;
  closeSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('jwt');
      const savedUsername = getCookie('username');

      if (token && savedUsername) {
        try {
          // Fetch fresh details from the backend to ensure token is valid and user info (avatar, block state) is up to date
          const details = await userService.getDetail(savedUsername);
          if (details.blocked) {
            signout();
          } else {
            setUser(details);
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          signout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for session-expired custom event (from Axios interceptor)
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const signin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      const { jwt, userDTO } = response.data;
      
      setCookie('jwt', jwt, 7);
      setCookie('username', userDTO.username, 7);
      
      setUser(userDTO);
      setShowSessionExpired(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    eraseCookie('jwt');
    eraseCookie('username');
    setUser(null);
    setShowSessionExpired(false);
  };

  const updateUser = (updated: UserDTO) => {
    setUser(updated);
  };

  const closeSessionExpired = () => {
    setShowSessionExpired(false);
    signout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signin,
        signout,
        updateUser,
        showSessionExpired,
        closeSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
