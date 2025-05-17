import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  isLoading: boolean; // Add this line
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  setToken: () => {},
  logout: () => {},
  setUser: () => {},
  isLoading: true, // Add this line with default value
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(Cookies.get('authToken') || null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); // Add this line

  // Set token in cookie with expiration
  const setToken = (newToken: string | null) => {
    if (newToken) {
      // Set cookie that expires in 7 days
      Cookies.set('authToken', newToken, { expires: 7, secure: true, sameSite: 'strict' });
      setTokenState(newToken);
      
      try {
        // Parse user data from token
        const decoded = jwtDecode<{ userId: string; name: string; email: string }>(newToken);
        setUser({
          id: decoded.userId,
          name: decoded.name || 'User',
          email: decoded.email || '',
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      Cookies.remove('authToken');
      setTokenState(null);
      setUser(null);
    }
  };

  // Load user data from token if it exists
  useEffect(() => {
    const loadUserFromToken = async () => {
      setIsLoading(true); // Start loading
      const storedToken = Cookies.get('authToken');
      
      if (storedToken) {
        try {
          // Parse user data from token
          const decoded = jwtDecode<{ userId: string; name: string; email: string }>(storedToken);
          setUser({
            id: decoded.userId,
            name: decoded.name || 'User',
            email: decoded.email || '',
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user data:', error);
          Cookies.remove('authToken');
          setTokenState(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // End loading
    };

    loadUserFromToken();
  }, [token]);

  const logout = () => {
    Cookies.remove('authToken');
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, setToken, logout, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};