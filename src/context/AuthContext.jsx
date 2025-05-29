import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

// Configure axios defaults
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const authCheckRef = useRef(false);

  const checkAuth = async () => {
    if (authCheckRef.current) return;
    authCheckRef.current = true;

    try {
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true') {
      checkAuth();
    } else if (error === 'true') {
      setError('Authentication failed');
      setLoading(false);
      setInitialCheckDone(true);
    } else if (!initialCheckDone) {
      checkAuth();
    }
  }, [initialCheckDone]);

  const login = () => {
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        withCredentials: true
      });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    initialCheckDone
  };

  if (loading && !initialCheckDone) {
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