import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/payments`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation({
            query: (data) => ({
                url: '/create-intent',
                method: 'POST',
                body: data,
            }),
        }),
        confirmPayment: builder.mutation({
            query: (paymentIntentId) => ({
                url: `/confirm/${paymentIntentId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useCreatePaymentIntentMutation,
    useConfirmPaymentMutation,
} = paymentApi;
