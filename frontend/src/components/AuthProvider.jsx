import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectIsAuthenticated } from '../store/authSlice';
import { useGetMeQuery } from '../services/authApi';
import { Box, CircularProgress } from '@mui/material';

/**
 * AuthProvider - Validates token and fetches user data on app load
 * Wraps the app to ensure auth state is properly hydrated
 */
const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const token = useSelector(selectAuthToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Skip the query if there's no token stored
  const { isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    // If no token, we're done initializing
    if (!token) {
      setIsInitialized(true);
      return;
    }

    // If query completed (success or error), we're done initializing
    if (isSuccess || isError) {
      setIsInitialized(true);
    }
  }, [token, isSuccess, isError]);

  // Show loading while validating token
  if (!isInitialized && token && isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress size={48} sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  return children;
};

export default AuthProvider;
