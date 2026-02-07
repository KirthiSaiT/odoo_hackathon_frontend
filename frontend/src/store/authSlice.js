import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

const initialState = {
  user: null,
  token: sessionStorage.getItem('access_token') || null,
  isAuthenticated: false,
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
      sessionStorage.setItem('access_token', access_token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem('access_token');
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
      sessionStorage.setItem('access_token', action.payload.access_token);
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
  },
});

export const { setCredentials, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
