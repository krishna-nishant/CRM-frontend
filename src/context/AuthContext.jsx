import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:3000/api/auth/me', {
        withCredentials: true
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:3000/api/auth/logout', {
        withCredentials: true
      });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="p-8 rounded-2xl bg-white shadow-lg flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium animate-pulse">
            Initializing your workspace...
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Please wait while we set up your session
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 