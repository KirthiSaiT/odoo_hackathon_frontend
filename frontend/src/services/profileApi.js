import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Profile API with RTK Query
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Get current user's profile
    getMyProfile: builder.query({
      query: () => '/profile/me',
      providesTags: ['Profile'],
    }),

    // Update current user's profile
    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: '/profile/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Get any user's profile (admin)
    getUserProfile: builder.query({
      query: (userId) => `/profile/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],
    }),

    // Update any user's profile (admin)
    updateUserProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/profile/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Profile', id: userId }, 'Profile'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = profileApi;

export default profileApi;
