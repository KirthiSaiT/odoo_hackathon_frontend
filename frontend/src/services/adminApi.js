import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  prepareHeaders: (headers, { getState }) => {
    // Get token from state
    const token = getState().auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Admin API with RTK Query
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['Employees', 'Lookups', 'Users'],
  endpoints: (builder) => ({
    // Get all lookups
    getLookups: builder.query({
      query: () => '/admin/lookups',
      providesTags: ['Lookups'],
    }),

    // Get list of employees
    getEmployees: builder.query({
      query: ({ page = 1, size = 10, search = '' }) => ({
        url: '/admin/employees',
        params: { page, size, search },
      }),
      providesTags: ['Employees'],
    }),

    // Get single employee
    getEmployee: builder.query({
      query: (id) => `/admin/employees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employees', id }],
    }),

    // Create employee
    createEmployee: builder.mutation({
      query: (data) => ({
        url: '/admin/employees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employees', 'Users', 'Stats'],
    }),

    // Update employee
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Employees',
        'Users',
        'Stats',
        { type: 'Employees', id }
      ],
    }),

    // Get list of users
    getUsers: builder.query({
      query: ({ page = 1, size = 10, search = '' }) => ({
        url: '/admin/users',
        params: { page, size, search },
      }),
      providesTags: ['Users'],
    }),

    // Create user
    createUser: builder.mutation({
      query: (data) => ({
        url: '/admin/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    // Get user rights
    getUserRights: builder.query({
      query: (userId) => `/admin/rights/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'UserRights', id: userId }],
    }),

    // Save user rights
    saveUserRights: builder.mutation({
      query: ({ userId, rights }) => ({
        url: `/admin/rights/user/${userId}`,
        method: 'POST',
        body: rights,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'UserRights', id: userId }],
    }),

    // Get dashboard stats
    getStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Employees', 'Users'], // Invalidate when entities change
    }),
  }),
});

export const {
  useGetLookupsQuery,
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserRightsQuery,
  useSaveUserRightsMutation,
  useGetStatsQuery,
} = adminApi;

export default adminApi;
