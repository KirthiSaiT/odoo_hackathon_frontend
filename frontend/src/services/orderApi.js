import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/orders/stats',
        }),
        checkout: builder.mutation({
            query: () => ({
                url: '/orders/checkout',
                method: 'POST',
            }),
        }),
        getOrderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
        getOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders'],
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders/checkout',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useCheckoutMutation,
    useGetOrdersQuery,
    useCreateOrderMutation,
    useGetOrderDetailsQuery
} = orderApi;
