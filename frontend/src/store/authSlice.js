import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

// Helper functions for localStorage persistence
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('access_token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    return {
      token,
      user,
      isAuthenticated: !!(token && user),
    };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return { token: null, user: null, isAuthenticated: false };
  }
};

const saveAuthState = (token, user) => {
  try {
    if (token && user) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

const clearAuthState = () => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

// Load persisted state
const persistedState = loadAuthState();

const initialState = {
  user: persistedState.user,
  token: persistedState.token,
  isAuthenticated: persistedState.isAuthenticated,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      state.error = null;
      saveAuthState(access_token, user);
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      if (state.token) {
        saveAuthState(state.token, action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthState();
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action to restore auth from localStorage (useful after token validation)
    restoreAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!(token && user);
      if (token && user) {
        saveAuthState(token, user);
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      saveAuthState(action.payload.access_token, action.payload.user);
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.data?.detail || 'Login failed';
    });

    // Signup
    builder.addMatcher(authApi.endpoints.signup.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.signup.matchFulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.data?.detail || 'Signup failed';
    });

    // Get Current User (getMe - for refreshing user data)
    builder.addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (state.token) {
        saveAuthState(state.token, action.payload);
      }
    });
    builder.addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
      // Token is invalid, clear auth state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthState();
    });
  },
});

export const { setCredentials, updateUser, logout, setError, clearError, restoreAuth } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
