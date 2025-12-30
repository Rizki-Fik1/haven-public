import { createContext, useContext, useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthQuery, useLogout } from '../services/authService';
import { getAuthToken, setAuthToken, clearAuthData } from '../lib/authUtils';

const AuthContext = createContext(undefined);

const AuthProvider = memo(({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Use the auth query hook
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
    refetch: refetchAuth,
  } = useAuthQuery({
    enabled: !!getAuthToken(),
  });

  // Use logout mutation
  const logoutMutation = useLogout();

  // Initialize auth state
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsInitialized(true);
      return;
    }

    // If we have a token but no auth data yet, wait for the query
    if (authData?.success && authData.user) {
      setUser(authData.user);
      setIsInitialized(true);
    } else if (authError) {
      // If there's an error, clear the token
      clearAuthData();
      setUser(null);
      setIsInitialized(true);
    }
  }, [authData, authError]);

  // Handle case when token exists but query hasn't run yet
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsInitialized(true);
    }
  }, []);

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    setIsInitialized(true); // Ensure initialized state is set
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
        clearAuthData();
        navigate('/login');
      },
      onError: () => {
        // Even if logout fails on server, clear local state
        setUser(null);
        clearAuthData();
        navigate('/login');
      },
    });
  };

  const refreshAuth = () => {
    refetchAuth();
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isLoading = !isInitialized || (isAuthLoading && !!getAuthToken());
  const isAuthenticated = !!user && !!getAuthToken();

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';

/**
 * Hook to access auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
