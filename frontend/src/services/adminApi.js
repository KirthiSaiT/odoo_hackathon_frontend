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
  tagTypes: ['Employees', 'Lookups', 'Users', 'Roles', 'UserRights', 'Stats'],
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

    // Delete employee
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/admin/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees', 'Stats'],
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

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
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
      providesTags: ['Stats'],
    }),

    // =====================
    // ROLES ENDPOINTS
    // =====================

    // Get list of roles
    getRoles: builder.query({
      query: ({ page = 1, size = 100, search = '' }) => ({
        url: '/admin/roles',
        params: { page, size, search },
      }),
      providesTags: ['Roles'],
    }),

    // Create role
    createRole: builder.mutation({
      query: (data) => ({
        url: '/admin/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles', 'Stats', 'Lookups'],
    }),

    // Update role
    updateRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Roles', 'Lookups'],
    }),

    // Delete role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles', 'Stats', 'Lookups'],
    }),
  }),
});

export const {
  useGetLookupsQuery,
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserRightsQuery,
  useSaveUserRightsMutation,
  useGetStatsQuery,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = adminApi;

export default adminApi;

