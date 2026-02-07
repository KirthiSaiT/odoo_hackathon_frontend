/**
 * Subscriptions API Service
 * RTK Query slice for subscription management
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const subscriptionsApi = createApi({
    reducerPath: 'subscriptionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/subscriptions`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Subscriptions'],
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            query: ({ page = 1, size = 10, search = '' }) => ({
                url: '/',
                params: { page, size, search },
            }),
            providesTags: ['Subscriptions'],
        }),
        getSubscriptionById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Subscriptions', id }],
        }),
        createSubscription: builder.mutation({
            query: (newSubscription) => ({
                url: '/',
                method: 'POST',
                body: newSubscription,
            }),
            invalidatesTags: ['Subscriptions'],
        }),
        updateSubscription: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Subscriptions', id }, 'Subscriptions'],
        }),
        deleteSubscription: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subscriptions'],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useGetSubscriptionByIdQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} = subscriptionsApi;
