import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { authApi } from '../services/authApi';
import { adminApi } from '../services/adminApi';
import { profileApi } from '../services/profileApi';
import { productsApi } from '../services/productsApi';
import { cartApi } from '../services/cartApi';

import { isRejectedWithValue } from '@reduxjs/toolkit';
import { logout } from './authSlice';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `isRejectedWithValue` to indicate a server error
  if (isRejectedWithValue(action)) {
    if (action.payload.status === 401) {
      // Unauthorized - token expired or invalid
      api.dispatch(logout());
      window.location.href = '/login'; // Force redirect
    }
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      adminApi.middleware,
      profileApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
      rtkQueryErrorLogger
    ),
});

setupListeners(store.dispatch);

export default store;
