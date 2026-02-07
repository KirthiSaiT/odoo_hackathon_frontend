import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { authApi } from '../services/authApi';
import { adminApi } from '../services/adminApi';
import { productsApi } from '../services/productsApi';
import { cartApi } from '../services/cartApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, adminApi.middleware, productsApi.middleware, cartApi.middleware),
});

setupListeners(store.dispatch);

export default store;
